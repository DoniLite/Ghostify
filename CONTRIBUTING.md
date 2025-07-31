# Contributing to Ghostify

Thank you for your interest in contributing to Ghostify! We welcome contributions from everyone, whether you're fixing a bug, adding a feature, or improving documentation.

## 🚀 Getting Started

### Development Environment Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/ghostify.git
   cd ghostify
   ```

3. **Install dependencies**:

   ```bash
   bun install
   ```

4. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Fill in the required values in your `.env` file.

5. **Start the development server**:

   ```bash
   bun run dev:server
   ```

### Development Workflow

1. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following our coding standards (see below)

3. **Test your changes** thoroughly:

   ```bash
   bun run test
   ```

4. **Commit your changes** with a descriptive message:

   ```bash
   git add .
   git commit -m "feat: add real-time cursor tracking"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub:
Notice that your pull request has to target the **develop** branch

## 📝 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **Biome** rules (run `bun run lint`)
- Use **meaningful variable names** and add comments for complex logic
- Prefer **async/await** over promise chains
- Use **destructuring** where appropriate
- All services are using **DTO -> Repository -> Service** logic for data validation and CRUD operations

### React Components

- Use **functional components** with hooks
- Keep components **small and focused**
- Use **TypeScript interfaces** for props
- Follow **React best practices** for performance

Example component structure:

```typescript
interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onSubmit 
}) => {
  // Component logic here
  
  return (
    <div>
      {/* JSX here */}
    </div>
  );
};
```

### API Routes

- Use **proper HTTP status codes**
- Include **input validation** for all endpoints
- Add **error handling** with meaningful messages
- Document new endpoints in the README

Example route structure:

```typescript
app.post('/api/v1/documents', async (c) => {
  try {
    // Validation
    const body = await c.req.json();
    // ... validation logic
    
    // Business logic
    const result = await createDocument(body);
    
    return c.json({ data: result }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create document' }, 500);
  }
});
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun run test
```

### Writing Tests

- Write tests for **all new features**
- Include **edge cases** and **error scenarios**
- Use **descriptive test names**
- Follow the **AAA pattern** (Arrange, Act, Assert)

Example test:

```typescript
describe('DocumentService', () => {
  describe('createDocument', () => {
    it('should create a new document with valid data', async () => {
      // Arrange
      const documentData = { title: 'Test Doc', content: 'Hello' };
      
      // Act
      const result = await createDocument(documentData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Doc');
    });
  });
});
```

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] Tests pass locally (`bun run test`)
- [ ] Linting passes (`bun run lint`)
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional commits format

### Pull Request Template

When creating a PR, please include:

**Description**
Brief description of what this PR does

**Type of Change**

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

**Testing**

- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

**Screenshots** (if applicable)
Add screenshots to help explain your changes

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details** (OS, Bun version, browser)
2. **Steps to reproduce** the issue
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** or error messages if applicable
6. **Additional context** that might be helpful

Use our bug report template:

```markdown
**Environment:**
- OS: [e.g. macOS 13.0]
- Bun version: [e.g. 1.0.15]
- Browser: [e.g. Chrome 119]

**Steps to reproduce:**
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior:**
A clear description of what you expected to happen.

**Actual behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots to help explain your problem.
```

## 💡 Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** if you have one in mind
4. **Consider the impact** on existing users
5. **Be open to feedback** and alternative approaches

## 🎯 Areas for Contribution

We particularly welcome contributions in these areas:

### High Priority

- **Real-time collaboration features** (cursor tracking, user presence)
- **Performance optimizations** (caching, bundle size)
- **Security improvements** (rate limiting, input validation)
- **Test coverage** improvements

### Medium Priority

- **UI/UX enhancements**
- **Mobile responsiveness**
- **Accessibility improvements**
- **Documentation updates**

### Low Priority

- **Additional language support**
- **Theme customization**
- **Export/import features**

## 📚 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 💬 Getting Help

If you need help with contributing:

1. **Check the documentation** in this repository
2. **Search existing issues** for similar questions
3. **Ask in discussions** on GitHub
4. **Reach out to maintainers** if you're stuck

## 🏆 Recognition

Contributors will be recognized in several ways:

- Listed in the **Contributors** section of the README
- Mentioned in **release notes** for significant contributions
- **Badges** in GitHub profile for regular contributors

Thank you for contributing to Ghostify! 🚀
