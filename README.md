# Disaster Resiliency Hub
---

## Git Instructions (CLI)

### General rules about the GitHub repository for this project:

1. You cannot push changes to main or to dev
2. If you want to fix something, add a feature, or anything else (any new code),
   you must create a new branch off of dev, and work on that branch.
3. Once you have your feature branch working, you have to make a pull request to merge into dev.
    - The pull request must be approved by at least 1 other person, and then will get merged into dev.
4. Every once in awhile (maybe every week or two), we will merge dev into main. This will keep main always working
   but still give us a branch to merge all our work into (dev).
5. After you have added a feature and it has been merged into dev or main successfully, you should delete your
   feature branch.
6. There are rules in place in the repo to keep from pushing to main or dev.

### If you want to commit your work:

First add it

    - git add .
    
Then, commit it and give it a message

    - git commit -m "Your message here"

### If you want to push:

    - git push

### If you want to pull down all new changes and branches:

    - git pull

### If you want to create a new branch:

Switch to the branch you want to make your new branch off of:

    - git checkout branch-name
THEN, IMPORTANT! BEFORE YOU CREATE A NEW BRANCH, MAKE SURE YOU PULL ALL NEW CHANGES 
ON THE BRANCH YOU ARE BRANCHING FROM:

    - git pull
Finally, create your branch:

    - git checkout -b new-branch-name

---
