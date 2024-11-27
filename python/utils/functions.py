import os


def purge_files_after_transform(filename: str, dir: str):
    # Define the directory to be purged
    STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static'))
    directory_path = os.path.join(STATIC_DIR, dir)

    # Check if the directory exists
    if not os.path.exists(directory_path):
        print(f'Directory {directory_path} does not exist.')
        return False

    # Get all files in the directory
    files = os.listdir(directory_path)
    
    if not filename in files:
        print(f'File {filename} does not exist in the directory.')
        return False
    
    # Iterate through the files and remove them
    file_path = os.path.join(directory_path, filename)
    if os.path.isfile(file_path):
            os.remove(file_path)
            print(f'The file {filename} in {directory_path} have been removed.')
            return True
    return False