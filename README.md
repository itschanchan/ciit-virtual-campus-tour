# CIIT Virtual Campus Tour

A web-based virtual campus where CIITzens can explore the newly built Glitch Tower virtually!

## Core MVP Features:

- A 360° draggable panoramic view of featured locations in CIIT Glitch Tower Campus.
- Side bar menu for quick and easy navigation across the campus.
- Available in desktop and mobile!

---

## Dev Setups

This section contains instructions how to set up tools in the codebase.

### Clone GitHub Repository

There are two methods in cloning a repo which is using the VS Code UI (easy) and via terminal (faster but need to learn):

#### METHOD 1: VS Code GUI

1. Launch **VS Code**.
2. Enter `Ctrl + Shift + P` to open **Command Palette**.
3. Search "**Git: Clone**"
4. Select "**Clone from GitHub**"
5. Paste this URL `https://github.com/itschanchan/ciit-virtual-campus-tour.git` and then open the repository.
6. Choose a destination folder where you want to work the CIIT Virtual Campus Tour locally in your PC.
7. Open the project and tadaaa! Happy coding :3

#### METHOD 2: via Terminal

You can clone this repository using the terminal in any OS that you are currently using.

1. Open the terminal in VS Code.
2. Go to your file path using the `cd` command.

Examples:

**Windows**

```bash
C:\user\my-projects\ciit-virtual-campus-tour>
```

**Linux**

```bash
user@linux-os: /my-projects/ciit-virtual-campus-tour>
```

3. Paste this command: `git clone https://github.com/itschanchan/ciit-virtual-campus-tour.git`
4. Open the folder and you're good to go! :3

---

### NodeJS Installation

To install NodeJS, you must run the following commmands in your terminal:

```bash
nvm install --lts
```

Activate that version:

```bash
nvm use --lts
```

Check the version:

```bash
node -v
```

#### Installing Package Dependencies

Execute this command to install dependencies in your target folder:

```bash
npm install <package_name>
```

#### Scan and Repair Dependencies

This command is useful in fixing dependencies on `package.json` and `package-lock.json` files:

```bash
npm audit fix
```

---
