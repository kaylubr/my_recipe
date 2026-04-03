Bago kayo mag start, download kayo wsl para seamless experience lang. (Google niyo installation step by step)

Tapos installan niyo node js yung wsl

Then type niyo to after:
```
git config --global user.name <github username>
git config --global user.email <github email>
```

then clone niyo tong repo na to.
```
cd my_recipe/my_recipe
```

tapos install dependencies 
```
npm install
```

tapos wag kayo basta git commit and push. gawa muna kayo branch para incase mag kandakanda loko na,
hindi sa pinaka main copy mag apply yung sirang changes.
```
git checkout -b <branch name>
```

then tsaka niyo ilagay changes niyo. safe na mag git add, commit, and push.
after niyo magawa changes niyo and tingin niyong wala ng bug, push niyo na and i-merge it sa main branch.
eto yung commands:
```
git checkout main
git merge <name ng branch na ginawa niyo>
```