import axios from "axios";
import Search from "./model/Search";
import {elements, renderLoader, clearLoader} from "./view/base";
import * as searchView from "./view/searchView";
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