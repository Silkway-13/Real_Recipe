import axios from "axios";
import Search from "./model/Search";
import {elements, renderLoader, clearLoader} from "./view/base";
import * as searchView from "./view/searchView";
import * as listView from "./view/listView";
import * as likeView from "./view/likesView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import Likes from "./model/Like";
import { renderRecipe, clearRecipe, highlightSelectedRecipe} from "./view/recipeView";
// web app state
// хайлтын query, result

// hailtiin controller 
const state = {};

const controlSearch = async () => {
      const query = searchView.getInput();

      if(query) {
            state.search = new Search(query);
            searchView.clearSearchQuery();
            searchView.clearSearchResult();
            renderLoader(elements.searchResultDiv);

            await state.search.doSearch();

            clearLoader();
            // console.log(state.search.result);
            if(state.search.result === undefined) alert("no result");
            else searchView.renderRecipes(state.search.result, );
      }
};

elements.searchForm.addEventListener("submit", e => {
      e.preventDefault();
      controlSearch();
});

elements.pageButtons.addEventListener("click", e => {
      const btn = e.target.closest(".btn-inline");

      if(btn) {
            const gotoPageNumber = parseInt(btn.dataset.goto);
            searchView.clearSearchResult(); 
            searchView.renderRecipes(state.search.result, gotoPageNumber);
      }
});


// jorin controller
const controlRecipe = async () => {
      const id = window.location.hash.replace("#", "");

      // if exist id
      if(id) {
            state.recipe = new Recipe(id);
      
            clearRecipe();
            renderLoader(elements.recipeDiv);
            highlightSelectedRecipe(id);
      
            await state.recipe.getRecipe();
      
            clearLoader();
            state.recipe.calcTime();
            state.recipe.calcHvniiToo();
      
            renderRecipe(state.recipe, state.likes.isLiked(id));
      }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach(e => window.addEventListener(e, controlRecipe));

window.addEventListener("load", e => {
      if(!state.likes) state.likes = new Likes();

      likeView.toggleLikeMenu(state.likes.getNumberOfLikes());

      state.likes.likes.forEach(like => likeView.renderLike(like));
});

// Nairlagiin controller
const controlList = () => {
      // 
      state.list = new List();

      listView.clearItems();

      state.recipe.ingredients.forEach(n => {
            const item = state.list.addItem(n);

            listView.renderItem(item);
      });
};

elements.recipeDiv.addEventListener("click", e => {
      if(e.target.matches(".recipe__btn, .recipe__btn *"))
            controlList();
      else if(e.target.matches(".recipe__love, .recipe__love * ")){
            controlLike();
      }
});

elements.shoppingList.addEventListener("click", e => {
      const id = e.target.closest(".shopping__item").dataset.itemid;
      state.list.deleteItem(id);

      listView.deleteItem(id);
});

// Faverite controller
const controlLike = () => {
      if(!state.likes) state.likes = new Likes();

      const currentRecipeId = state.recipe.id;

      if(state.likes.isLiked(currentRecipeId)) {
            state.likes.deleteLike(currentRecipeId);
            likeView.toggleLikeButton(false);
            // delete from menu
            likeView.deleteLike(currentRecipeId);
      } else {
            const newLike = state.likes.addLike(
                  currentRecipeId, 
                  state.recipe.title, 
                  state.recipe.publisher, 
                  state.recipe.image_url
                  );

            likeView.renderLike(newLike);
            likeView.toggleLikeButton(true);

      }
      likeView.toggleLikeMenu(state.likes.getNumberOfLikes());
};