import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config';
import * as model from './model.js';
//配方视图
import recipeView from './views/recipeView.js';
// 搜索视图
import searchView from './views/searchView.js';
// 结果视图
import resultsView from './views/resultsView.js';
// 页视图
import paginationView from './views/paginationView.js';
// 书签视图
import bookmarksView from './views/bookmarksView.js';
//添加配方视图
import addRecipeView from './views/addRecipeView.js';
// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    let id = window.location.hash.slice(1);
    // id = `5ed6604591c37cdc054bc886`;
    if (!id) return;
    //加载的动画
    recipeView.renderSpinner();
    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //
    bookmarksView.update(model.state.bookmarks);
    // 1. Loading recipe 加载食谱
    await model.loadRecipe(id);
    // 2. Rendering recipe 渲染食谱
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    // alert(error);
    recipeView.renderError(
      `We could not find that recipe. Please try another one!`
    );
  }
};
const controlSearchResults = async function () {
  try {
    // console.log(resultsView, 100);
    resultsView.renderSpinner(); //加载器
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //Load search result
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    // Render NEW results
    resultsView.render(model.getSearchResultsPage(1)); //搜索后显示的配方
    //Render initial pagination buttons
    paginationView.render(model.state.search); //上下页按钮显示
  } catch (error) {
    console.error(error);
  }
};
const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage)); //搜索后显示的配方
  //Render NEW pagination buttons
  paginationView.render(model.state.search); //上下页按钮显示
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 控制添加或删除书签
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe)
    : model.addBookmark(model.state.recipe);
  //更新配方视图
  recipeView.update(model.state.recipe);
  // Render bookmarks 渲染书签
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
