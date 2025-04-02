# Contributing Tutorials to Movement Developer Portal

This guide explains how to contribute tutorials to the Movement Developer Portal. You can contribute either written tutorials (which will be hosted directly on our site) or external tutorials (which link to content hosted elsewhere).

## Types of Tutorials

1. **Written Tutorials**: Markdown files hosted directly in our repository
2. **External Tutorials**: Links to tutorials hosted on external platforms (YouTube, blog posts, documentation, etc.)

## Adding a Written Tutorial

### Step 1: Create the Markdown File

1. Create a new markdown file in the `content/Tutorials` directory
2. Name your file using the format: `Tutorial-Name.md`
3. Include the following frontmatter at the top of your markdown file:

```markdown
---
title: "Your Tutorial Title"
description: "A brief description of your tutorial"
date: "YYYY-MM-DD"
---
```

### Step 2: Writing the Tutorial

Follow these guidelines for your tutorial content:

1. Start with a clear introduction explaining what will be covered
2. Break down the content into logical sections using headers (## for main sections)
3. Include code snippets using triple backticks with language specification:
   ```move
   // Your Move code here
   ```
4. Add images if needed (place them in `public/images/tutorials/`)
5. End with a conclusion and next steps

### Step 3: Add to tutorials.json

Add your tutorial to `content/tutorials.json` with the following structure:

```json
{
  "your-tutorial-slug": {
    "category": "Beginner|Intermediate|Advanced",
    "title": "Your Tutorial Title",
    "description": "Brief description (1-2 sentences)",
    "amt": "estimated time (e.g., '15m', '1h')",
    "type": "written",
    "markdownFile": "Tutorial-Name.md",
    "tags": ["relevant", "tags"],
    "featured": false
  }
}
```

## Adding an External Tutorial

To add an external tutorial, you only need to modify the `content/tutorials.json` file:

```json
{
  "your-tutorial-slug": {
    "category": "Beginner|Intermediate|Advanced",
    "title": "Your Tutorial Title",
    "description": "Brief description (1-2 sentences)",
    "amt": "estimated time (e.g., '15m', '1h')",
    "type": "external",
    "link": "https://your-tutorial-url.com",
    "tags": ["relevant", "tags"],
    "featured": false
  }
}
```

## Guidelines for All Tutorials

1. **Categories**:
   - Beginner: Fundamental concepts, basic setup
   - Intermediate: More complex topics, requires basic knowledge
   - Advanced: Expert-level content, requires solid understanding

2. **Tags**: Choose relevant tags from common categories:
   - Technology: "Move", "Solidity", "CLI"
   - Content Type: "Code Along", "Code Review", "Workshop"
   - Topic: "Contract", "Setup", "Security"

3. **Description**: Keep descriptions:
   - Clear and concise
   - Action-oriented ("Learn how to...", "Build a...")
   - Under 150 characters

4. **Estimated Time**: 
   - Use format: "XXm" for minutes, "XXh" for hours
   - Be realistic about completion time
   - Include setup time if relevant

## Pull Request Process

1. Fork the repository
2. Create a new branch: `git checkout -b tutorial/your-tutorial-name`
3. Add your tutorial content
4. Test locally if adding a written tutorial
5. Create a pull request with:
   - Clear description of the tutorial
   - Any dependencies or prerequisites
   - Screenshots if relevant

## Need Help?

- Check existing tutorials for examples
- Open an issue for questions
- Join our Discord community for support

## Review Process

Your tutorial will be reviewed for:
1. Technical accuracy
2. Writing quality and clarity
3. Adherence to guidelines
4. Proper formatting

