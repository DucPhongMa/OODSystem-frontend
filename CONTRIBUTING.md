# Making Project Contributions - Using Git

1. Install Git, VS Code, Node.JS

2. Go to the location in your computer where you want the repo to be cloned. Right click and go to `Open Git Bash here`.

3. In git bash, clone the repo to your local. For the backend repo the URL would be different.

```
git clone https://github.com/DucPhongMa/OODSystem-frontend.git
```

VS Code should now open and you should be in the `OODSystem-frontend` directory.

3. Open the `OODSystem-frontend` directory in VS Code.

Go into the `OODSystem-frontend` folder.
Either type `powershell` and `[Enter]` in the Windows path, or right click and go to `Open Git Bash here`. In either case you have opened a terminal.
Run `code .` command.
Wait a couple seconds and VS Code should open and you should be inside the `OODSystem-frontend` directory.
You can tell you are inside the directory by going to Terminal > New Terminal (or Ctrl+Shift+`) and the terminal should show your current location.

Your terminal should show something like this:
```
PS F:\projects\OODSystem-frontend>
```

Now you can close the powershell or git bash terminal that you previously used to run `code .`

3. Run `npm install`. Most likely you only need to do this once, unless someone has installed something new.

```
npm install
```

4. You can use the following code to get the latest code.

```
git pull origin master
```

5. You can use the following code to check what branch you are currently on.

```
git status
```

6. You can use the following code to start the frontend server.

```
npm run dev
```

Wait until the loading finishes and you are given the `http://localhost:3000` and well as a `Ready in X.Xs` message.
Open a browser and navigate to http://localhost:3000/management/register
You should see the current management interface registration page
To change the look of this page, simply go to `./src/app/(routes)/management/register/page.js` and change the code there.
No need to stop the server, you can change the code of the `page.js` and hit save, then the browser contents will automatically refresh.

7. Before pushing work to GitHub, make sure you create a topic branch. If you started to do work and did not create a branch yet, no worries.
It is only a problem if you committed and pushed work to the wrong branch (say you committed to main) but even then there is a fix, so please contact the team to get the appropriate git command.

The following is assuming you have not committed any work to the main branch. It does not matter if you have started work or not.

How to create a topic branch:

```
git checkout -b branchName
```

Name the branch something that can accurately depict what you are working on. For example, if I am working on adding documentation, I could call my branch add-documentation.

to check what branch you are on, do `git status` at any time.

8. Add and commit your code.

Now that you are on the topic branch, you can add and commit your code.

First check what files are "new" or have been "updated" by you working.

```
git status
```

In red are shown your file changes. Do not add or commit the package-lock.json even if it is in red.
If you notice any file in red that you did not make changes to (package-lock.json aside..) you can restore it to its old version (maybe you edited by accident). But be careful because this will erase your work on that file if you did work on it.

```
git restore theFileYouWantToChangeBack
```

For the files in red that you want to add and commit, do:

```
git add theFileName
```

Example: `git add CONTRIBUTING.md`
Example: `git add src/app/(routes)/management/register/page.js`

No need to type these long paths, simply copy paste it from the git status!

Do this for each file you changed or added.

Now do `git status` again and you will see these files are now green.

Now you can do `git commit -m "message_describing_what_you_did"`

Example: `git commit -m "added CONTRIBUTING.md documentation"`

9. Push your code to your topic branch.

```
git push origin branchName
```

Example: `git push origin add-documentation`