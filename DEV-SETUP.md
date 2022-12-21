Things you'll need access to:
* Rando-Mania RandoTracker git hub repository
* Rando-tracker Firebase project
* RandoTracker itself


## Install Git

download and install git from [https://git-scm.com/downloads](https://git-scm.com/downloads) 


### Clone the randoTracker repo to your computer

1. right-click in the folder you'd like to use for the repo and click `Git Bash Here` 

2. in the git bash terminal:

make a copy of the Rano-Mania RandoTracker repo with:

`git clone https://github.com/Rando-Mania/RandoTracker.git`

Re-open gitbash in the folder that was created - will be called RandoTracker. Create a branch on your computer to work from.

The following example creates a branch called `test-branch`:

	git checkout -b test-branch

Make your changes to the branch you just made.

You'll need to `push` this branch live for anyone else to see it

## Firebase setup

RandoTracker uses Firebase for database and hosting of the tracker files. So you'll need to set up access to Firebase for local development.

Firebase CLI (command line interface) requires npm (node package manager) you can get it through node.js https://nodejs.org

Firebase command line interface set up:  [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)

## Hook the folder up to the Firebase project

shift + right-click in the folder with the firebase.json file to open this folder in powershell: 

Initiate the folder to the firebase project with `firebase init`. All we really want to do is run the "project setup" part of `forebase init` but there doesn't seem to be an option for that so the process will create some unnecessary duplicate files, just delete them (will be looking for a way around this).

once the "init" process is done you can use `firebase serve` to access the firebase database and storage locally for development.

![image](https://user-images.githubusercontent.com/1286791/209013135-6ba1f635-135f-446a-a388-5464b2a08ecc.png)

## Send changes to the live Github for others to see 

que the changes to be pushed (back to gitbash):
	git add *

give the changes a description about what you changed
	git commit -m "added tracking icons"

send the qued changes to the live repository
	git push origin branch-name
  

Guide to git: [http://rogerdudler.github.io/git-guide/](http://rogerdudler.github.io/git-guide/) 
