* Install git
* github
* Firebase 
https://firebase.google.com/docs/cli

# Install Git

download and install git from [https://git-scm.com/downloads](https://git-scm.com/downloads) 


## Clone the randoTracker repo to your computer

1. right-click in the folder you'd like to use for the repo and click `Git Bash Here` 

2. in the git bash terminal:

make a copy of the Rano-Mania RandoTracker repo with:

`git clone https://github.com/Rando-Mania/RandoTracker.git`

Re-open gitbash in the folder that was created - will be called RandoTracker. Create a branch on your computer to work from.

The following example creates a branch called `test-branch`:

	git checkout -b test-branch

Make your changes to the branch you just made.

You'll need to `push` this branch live for anyone else to see it

# Firebase setup

standalone binary or npm

Firebase command line interface:  [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)

# Hook the folder up to the Firebase project

shift + right-click in the folder with the firebase.json file to open this foler in powershell: 

Initiate the folder to the firebase project:

	type `firebase init`
  press enter
  y
  press enter
  select `Database: Deploy Firebase Realtime Database Rules`
  select `use an existing project`
  select 'rando-tracker (rando-tracker)'
  press `enter` to select the default (database.rules.json)
  y

# Send changes to the live Github for others to see 

que the changes to be pushed (back to gitbash):
	git add *

give the changes a description about what you changed
	git commit -m "added tracking icons"

send the qued changes to the live repository
	git push origin branch-name
  

Guide to git: [http://rogerdudler.github.io/git-guide/](http://rogerdudler.github.io/git-guide/) 
