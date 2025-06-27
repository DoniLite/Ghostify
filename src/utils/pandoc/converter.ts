// Deno standard library for path manipulation and running commands
import { join } from 'https://deno.land/std@0.224.0/path/mod.ts'
import { InputFormats, OutputFormats } from '../const/pandoc_enums.ts' // ADJUST THIS PATH TO WHERE YOUR ENUMS ARE SAVED!

/**
 * Represents a Pandoc conversion error.
 */
export class PandocConversionError extends Error {
  override name = 'PandocConversionError'
  constructor(
    message: string,
    public stdout?: string,
    public stderr?: string,
    public exitCode?: number
  ) {
    super(message)
    Object.setPrototypeOf(this, PandocConversionError.prototype)
  }
}

/**
 * Interface for configuration options for the PandocConverter.
 */
export interface PandocConverterOptions {
  /**
   * The path to the Pandoc executable. Defaults to 'pandoc' (assumes it's in your PATH).
   */
  pandocPath?: string
  /**
   * Optional directory for temporary files or output if not specified.
   */
  tempDir?: string
}

/**
 * Interface for the conversion process.
 */
export interface ConvertOptions {
  /**
   * The input content as a string.
   */
  content: string
  /**
   * The format of the input content.
   */
  from: InputFormats
  /**
   * The desired output format.
   */
  to: OutputFormats
  /**
   * Optional path to save the output file. If not provided, the output will be returned as a string.
   */
  outputFilePath?: string
  /**
   * An array of additional command-line arguments to pass directly to Pandoc.
   * This is where you'd include things like:
   * - `--lua-filter=path/to/filter.lua` for external plugins
   * - `--bibliography=refs.bib`
   * - `--csl=style.csl`
   * - `--template=mytemplate.html`
   * - `-s` (standalone)
   * - `-t markdown+footnotes` (for extensions)
   */
  additionalArgs?: string[]
  /**
   * If true, Pandoc's stdout and stderr will be logged to the console.
   */
  verbose?: boolean
}

/**
 * A class for converting documents using the Pandoc CLI.
 */
export class PandocConverter {
  private pandocPath: string
  private tempDir: string

  constructor(options?: PandocConverterOptions) {
    this.pandocPath = options?.pandocPath || 'pandoc'
    this.tempDir = options?.tempDir || Deno.makeTempDirSync() // Using Deno's temp dir
  }

  /**
   * Converts document content from one format to another using Pandoc.
   *
   * @param options - The conversion options.
   * @returns A Promise that resolves with the converted content (string) or the path to the output file.
   * @throws {PandocConversionError} if the Pandoc command fails.
   */
  public async convert(options: ConvertOptions): Promise<string> {
    const { content, from, to, outputFilePath, additionalArgs = [], verbose = false } = options

    const args: string[] = []
    args.push(`--from=${from}`)
    args.push(`--to=${to}`)

    // If an output file path is specified, Pandoc will write directly to it.
    // Otherwise, Pandoc writes to stdout.
    if (outputFilePath) {
      args.push(`--output=${outputFilePath}`)
    }

    // Add any additional arguments provided by the user
    args.push(...additionalArgs)

    // Prepare the command
    const command = new Deno.Command(this.pandocPath, {
      args: args,
      stdin: 'piped', // Pipe the input content to Pandoc's stdin
      stdout: outputFilePath ? 'inherit' : 'piped', // Inherit if writing to file, otherwise pipe
      stderr: 'piped'
    })

    if (verbose) {
      console.log(`Executing Pandoc command: ${this.pandocPath} ${args.join(' ')}`)
    }

    let process: Deno.ChildProcess
    try {
      process = command.spawn()

      // Write content to stdin
      const writer = process.stdin.getWriter()
      await writer.write(new TextEncoder().encode(content))
      writer.releaseLock()
      await process.stdin.close()

      const { code, stdout, stderr } = await process.output()

      const stdoutStr = new TextDecoder().decode(stdout)
      const stderrStr = new TextDecoder().decode(stderr)

      if (verbose && stderrStr) {
        console.error('Pandoc STDERR:\n', stderrStr)
      }

      if (code !== 0) {
        throw new PandocConversionError(
          `Pandoc conversion failed with exit code ${code}.`,
          stdoutStr,
          stderrStr,
          code
        )
      }

      // If outputFilePath was provided, Pandoc wrote to the file directly.
      // We return the path as confirmation.
      if (outputFilePath) {
        return outputFilePath
      } else {
        // Otherwise, return the stdout as the converted content.
        return stdoutStr
      }
    } catch (error) {
      if (error instanceof PandocConversionError) {
        throw error // Re-throw our custom error directly
      }
      // Catch errors related to spawning the process (e.g., pandoc not found)
      throw new PandocConversionError(
        `Failed to execute Pandoc: ${
          (error as Record<string, unknown>).message || 'Unknown error'
        }`,
        undefined,
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  /**
   * Helper to easily create a temporary file for writing content,
   * useful if you need to provide file paths to Pandoc.
   * @param content The content to write.
   * @param filename The desired filename (e.g., "my_document.md").
   * @returns The path to the created temporary file.
   */
  public async createTempFile(content: string, filename: string): Promise<string> {
    const filePath = join(this.tempDir, filename)
    await Deno.writeTextFile(filePath, content)
    return filePath
  }

  /**
   * Cleans up the temporary directory created by the converter.
   */
  public async cleanupTempDir(): Promise<void> {
    try {
      await Deno.remove(this.tempDir, { recursive: true })
    } catch (error) {
      console.warn(`Failed to remove temporary directory ${this.tempDir}: ${error}`)
    }
  }
}
