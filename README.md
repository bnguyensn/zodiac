# bnguyensn.com

### Underlying Technologies

* Node.js
* Express
* Webpack
* React

### Boilerplate parts

###### Essential generic files for any new projects that employ the same technologies

First, you should have these global packages:

```
yarn
```

Then the files you want are:

```
.babelrc
.env  /* NOTE: this file should NOT be committed to version control i.e. put it in your .gitignore. See the 'dotenv' package for details.
.gitignore
package.json
postcss.config.js
README.md
webpack.common.js
webpack.dev.js
webpack.prod.js
```

Having the `package.json`, do a `yarn install` :coffee:.

### Specific parts

The items below vary heavily between projects. But the most important ones are:

```
server/
    db/
    routes/
    views/
src/
    css/
    html/
    img/
    js/
    json/
    index.html
    index.js
app.js
```