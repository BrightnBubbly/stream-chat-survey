# Bootstrap your backend server with Express

## Install nodejs
After having some bad experiences of installing `nodejs` and `express` using some random instructions I found in various blog posts, I recommend that you use `nmv` (Node Version Manager) to install node js.

You can download and find full documentation [here](https://github.com/nvm-sh/nvm). I have copied some key instructions here, fyi.

## Install & Update Script

To install or update nvm, you should run the install script. To do that, you may either download and run the script manually, or use the following cURL or Wget command:

```terminal
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
```termainal
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

I used the first statement, the curl command and it worked without a hitch.

## Verify Installation

To verify that nvm has been installed, do:

```terminal
command -v nvm # which should output nvm
```

which should output nvm if the installation was successful. Please note that `which nvm` will not work, since nvm is a sourced shell function, not an executable binary.

## Usage

To download, compile, and install the latest release of node, do this:

```terminal
nvm install node # "node" is an alias for the latest version
```

And finally to confirm that node is install and working you can use either of the these two commands:

```terminal
node --version
which node
```

## Install express-generator

Once you have a working version of node, you can run the following command to install `express-generator`, which you will use to bootstrap your `backend `server. Note: I recommend that you install `express-generator` globally for the current user (and not under root).

```terminal
npm install -g express-generator # do not use 'sudo'
```
Now you are ready to bootstrap your `backend` server.

## Prepare to bootstrap

Determine where you will store your project and make a project folder in this location. Navigate to this location in terminal and run the following command:

```terminal
express backend
```

When you navidate into the `backend` folder, you will find the following resulting folders and files:
```terminal
-rw-rw-r-- 1  1075 app.js
drwxr-xr-x 2  4096 bin/
-rw-rw-r-- 1   295 package.json
drwxr-xr-x 5  4096 public/
drwxr-xr-x 2  4096 routes/
drwxr-xr-x 2  4096 views/
```

With this basic structure, you can now follow the instructions to build out the post from the main REAMDE.md.

