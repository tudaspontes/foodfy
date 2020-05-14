const fs = require('fs')
const data = require('../data.json')

exports.index = function (req, res) {
    return res.render('admin/index', { recipes: data.recipes });
}

exports.post = function (req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
        if(req.body[key] == "") {
            return res.send('Please fill all fields')
        }
    }
    
    let id = 1;

    const lastRecipe = data.recipes[data.recipes.length - 1];

    if (lastRecipe) {
        id = lastRecipe.id + 1;
    }

    data.recipes.push({
        id,
        ...req.body
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write file error")

        return res.redirect('/admin/recipes')
    })
}

exports.create = function (req, res) {
    res.render('admin/create')
}

exports.show = function (req, res) {
    
    const { id } = req.params

    const foundRecipe = data.recipes[id -1];

    if (!foundRecipe) return res.send('recipe not found');

    return res.render('admin/show', {recipe: foundRecipe});
}

exports.edit = function (req, res) {
    
    const { id } = req.params

    const foundRecipe = data.recipes[id -1];

    if (!foundRecipe) return res.send('recipe not found');

    return res.render('admin/edit', {recipe: foundRecipe});

}

exports.put = function (req, res) {
 
    const { id } = req.body

    let index = 0;

    const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
        if(id == recipe.id) {
            index = foundIndex
            return true
        }
    })

    // const foundRecipe = data.recipes[id -1];

    if (!foundRecipe) return res.send('recipe not found');

    const recipe = {
        ...foundRecipe,
        ...req.body
    }

    data.recipes[index] = recipe;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if(err) return res.send("Write error")
    })

    return res.redirect(`/admin/recipes/${id}`);

}

exports.delete = function (req, res) {
    const { id } = req.body;

    const filteredRecipes = data.recipes.filter(function(recipe){
        return recipe.id != id
    })

    data.recipes = filteredRecipes;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error")

        return res.redirect('/index')
    })
}