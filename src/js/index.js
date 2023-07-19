import axios from "axios";
import Search from "./model/Search";
import {elements, renderLoader, clearLoader} from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
// web app state
// хайлтын query, result

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
            else searchView.renderRecipes(state.search.result);
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

const r = new Recipe(47746);
r.getRecipe();