$(document).ready(function () {

  // Materialize JS to make carousel function
  var elems = document.querySelectorAll(".carousel");
  var instances = M.Carousel.init(elems);

  var instance = M.Carousel.init({
    fullWidth: true,
    indicators: true,
  });

  // Empty object that stores users random movie/food/drink recommendations and information

  var userCombination = {

    userMovieInfo: {
      mTitle: "",
      mYear: "",
      mImgSrc: "",
      mPlot: ""
    },

    userFoodInfo: {
      fTitle: "",
      fImgSrc: "",
      fRecipe: ""
    },




  }
  function renderHtml(html) {
    $("#user-input-section").load(html);
  }

  function populateFoodSelect() {

    // theMealDB query URL for food Catergories
    var foodTypeURL = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;

    // AJAX call to get the food catergories from theMealDB
    $.get(foodTypeURL).then(function (foodCategoryResponse) {
      // console.log(foodCategoryResponse);

      // Variable to access the foodCategoryResponse object
      var foodCategoryResults = foodCategoryResponse.meals;

      // For loop that loops the length of foodCategoryResults then returns the category for earch index position
      for (var i = 0; i < foodCategoryResults.length; i++) {
        // console.log(foodCategoryResults[i].strCategory);

        // Created element to display each food category in the select menu
        var foodCategoryDisplay = $("<option>").addClass("food-category").text(foodCategoryResults[i].strCategory);

        // Appends each option element to the select element parent
        $("#food-category-select").append(foodCategoryDisplay);

        // Materialize Jquery to initialize "select" menu
        $('select').formSelect();
      }
    });
  }

  function populateDrinkSelect() {

    // theCockTailDB query URL for drink Catergories
    var drinkTypeURL = `https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`;

    // AJAX call to get the food catergories from theCockTailDB
    $.get(drinkTypeURL).then(function (drinkCategoryResponse) {
      // console.log(drinkCategoryResponse);

      // Variable to access the drinkCategoryResponse object
      var drinkCategoryResults = drinkCategoryResponse.drinks;

      // For loop that loops the length of drinkCategoryResults then returns the category for earch index position
      for (var i = 0; i < drinkCategoryResults.length; i++) {
        // console.log(drinkCategoryResults[i].strCategory);

        // Created element to display each drink category in the select menu
        var drinkCategoryDisplay = $("<option>").addClass("drink-category").text(drinkCategoryResults[i].strCategory);

        // Appends each option element to the select element parent
        $("#drink-category-select").append(drinkCategoryDisplay);

        // Materialize Jquery to initialize "select" menu
        $('select').formSelect();
      }
    });
  }

  // On click of #app-start button ("start on html") #about-area (title & description is hidden)
  // Then the empty #user-input-section is loaded with the moviesection html
  $(document).on("click", "#app-start", function (event) {
    event.preventDefault(event);
    $("#about-area").hide();
    $("#carousel").hide();

    renderHtml("moviesection.html");
  });

  // on click of #movie-submit button (shown as submit on HTML)
  $(document).on("click", "#movie-submit", function (event) {
    event.preventDefault(event);

    // Empty Array that stores the user's movie inputs
    var userMovieInputs = [];

    // Variables that are the value of the #movie-user-input (ex. I type in Scarface, Star Wars, Titanic)
    var userMovie1 = $("#movie-user-input1").val();
    var userMovie2 = $("#movie-user-input2").val();
    var userMovie3 = $("#movie-user-input3").val();

    // Push of the user's 3 movie inputs into the userMovieInputs array
    userMovieInputs.push(userMovie1, userMovie2, userMovie3);

    // Random generated index position of the userMovieInputs Array
    var randomUserMovieInput = Math.floor(Math.random() * (userMovieInputs.length));
    // console.log(randomUserMovieInput);

    // Name of random movie from the userMovieInputsArray
    // console.log(userMovieInputs[randomUserMovieInput])

    // Themoviedb API Key
    var movieApiKey = "2938a7e57a5497d72c32f5b9a3fba36f";

    // URL to search a movie by name using the name of the random movie from the userMovieInputsArray
    var movieQueryURL = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&language=en-US&query=${userMovieInputs[randomUserMovieInput]}&page=1&include_adult=false`

    // AJAX call to get id number of the movie was passed through the movieQueryURL (ex. Scarface's id number is 111)
    if (userMovieInputs[randomUserMovieInput] !== "") {
      $.get(movieQueryURL).then(function (userResponse) {
        // console.log(userResponse);

        // Variable that is the id for the most popular version of a certain movie(?)
        // By index position (ex. 1983 scarface is at 0 position as it has the highest themoviedb popualrity rating,  1932's scarface has a index position of 1 as it is the second most popular verison of a movie by that same name)
        var movieId = userResponse.results[0].id;
        // console.log(movieId);

        // After getting the movieId number, it is passed through another themoviedb url relating to movie recommendations.
        var idQueryURL = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${movieApiKey}&language=en-US&page=1`;

        // AJAX call to generate random movie from themoviedb recommendations object
        $.get(idQueryURL).then(function (idResponse) {
          // console.log(idResponse);

          // variable that is the randomized index position of the idResponse call
          var randomMovieResult = Math.floor(Math.random() * idResponse.results.length);
          // console.log(randomMovieResult);

          // Varaible that takes the randomMovieResult number (index position) and then returns the object of the randomized movie
          var recMovieResult = idResponse.results[randomMovieResult];
          // console.log(recMovieResult);

          // Variable that gives release date of recomended (random movie), and using split() to return .release_date into an array and return just the movie release year
          var recMovieYear = recMovieResult.release_date.split("-");
          // Variable that gives recommended (random) movie poster using theMovieDB image url
          var recMoviePoster = `http://image.tmdb.org/t/p/w300${recMovieResult.poster_path}`;

          // Set empty userMovieInfo object with recommended random movie result data
          userMovieInfo = {
            mTitle: recMovieResult.title,
            mYear: recMovieYear[0],
            mImgSrc: recMoviePoster,
            mPlot: recMovieResult.overview
          }

          console.log(userMovieInfo);
        });
      });
      renderHtml("foodsection.html");
      populateFoodSelect()
    } else {
      alert("please enter Three Movies before submitting!")
      renderHtml("moviesection.hmtl");
    }
  });


  // on click of #food-submit button (shown as submit on HTML)
  $(document).on("click", "#food-submit", function (event) {

    // Variable to show what user selected for food category
    var userFoodCategory = $("#food-category-select").val();
    // console.log(userFoodCategory);

    // if statement to prevent user from leaving food select blank
    if (userFoodCategory === null) {
      alert("please select a food category");
    } else {

      // theMealDB to filter users selected food category
      var filterFoodURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${userFoodCategory}`;
      // AJAX call to get filtered response
      $.get(filterFoodURL).then(function (filteredResponse) {
        // console.log(filteredResponse);

        // Varialbe similar to randomUserMovieInput, that generates a random index position from the filteredResponse
        var randomFoodResult = Math.floor(Math.random() * filteredResponse.meals.length);
        // console.log(randomFoodResult);

        // Variable that takes the randomFoodResult (number/index position) and matches within the filteredResponse array of objects and returns the meal title
        var recFoodTitle = filteredResponse.meals[randomFoodResult].strMeal;
        // console.log(recFoodTitle);

        // Variable similar to recFoodTitle, that instead returning food title (.strMeal), it returns the food's image path
        var recFoodImage = filteredResponse.meals[randomFoodResult].strMealThumb;
        // console.log(recFoodImage);

        // Last AJAX call regarding food, this searches the recFoodTitle (food name) and is used to get the recipe source for the food
        var foodSearchURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${recFoodTitle}`;

        $.get(foodSearchURL).then(function (searchResponse) {
          // console.log(searchResponse);

          // Variable to return the recipe source (URL) from the searchResponse
          var recFoodRecipe = searchResponse.meals[0].strSource;
          // console.log(recFoodRecipe);

          userFoodInfo = {
            fTitle: recFoodTitle,
            fImgSrc: recFoodImage,
            fRecipe: recFoodRecipe
          }

          console.log(userFoodInfo);

        });

      });
      renderHtml("drinksection.html");
      populateDrinkSelect()
    }
  });
































});
