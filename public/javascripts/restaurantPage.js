// sets the search bradcrumb href to refer back to the previously searched result
function setSearchBreadcrumbHref() {
  var url = new URL(window.location.href);
  const numGuestsQuery = url.searchParams.get("numguests");
  const searchQuery = url.searchParams.get("search");
  const timeQuery = url.searchParams.get("time");
  const dateQuery = url.searchParams.get("date");
  const restaurantid = url.searchParams.get("restaurantid");

  var uri = URI('search.html');

  var query = uri.query(true);
  if (searchQuery != null) query.search = searchQuery;
  if (dateQuery != null) query.date = dateQuery;
  if (timeQuery != null) query.time = timeQuery;
  if (numGuestsQuery != null) query.numguests = numGuestsQuery;
  query.restaurantid = restaurantid;
  uri.query(query);
  document.getElementById("searchBreadcrumb").href = uri;
}
setSearchBreadcrumbHref();

// Switch from 'confirm your details' modal to 'successfully made a booking' modal
$(document).on("click", "#finalConfirm", function(){
    $('#confirmBookingTwo').modal('show');
    $('#modalConfirmBooking').modal('hide');
});

// Switch from 'successfully made a booking' modal to 'manage your bookings' modal
$(document).on("click", "#goManageBookings", function(){
    $('#bookingModal').modal('show');
    $('#confirmBookingTwo').modal('hide');
});

// Go to top
$("#topButton").click(function() {
    $('html,body').animate({
        scrollTop: $("#top").offset().top},
        'slow');
});

// Go to about section
$("#aboutButton").click(function() {
    $('html,body').animate({
        scrollTop: $("#aboutSection").offset().top},
        'slow');
});

// Go to menu section
$("#menuButton").click(function() {
    $('html,body').animate({
        scrollTop: $("#menuSection").offset().top},
        'slow');
});

// Go to reviews section
$("#reviewsButton").click(function() {
    $('html,body').animate({
        scrollTop: $("#reviewsSection").offset().top},
        'slow');
});

// Go to map section
$("#mapButton").click(function() {
    $('html,body').animate({
        scrollTop: $("#mapSection").offset().top},
        'slow');
});

// Submits a review to the server and reloads the review section
function submitReview() {
  var reviewDiv = document.getElementById("insertReview");
  const description = reviewDiv.getElementsByTagName("TEXTAREA")[0].value;
  const noiseRating = document.getElementById("noise_rating").value;
  // console.log(description);

  const ratings = reviewDiv.getElementsByTagName("INPUT");

  var url = new URL(window.location.href);
  const RESTAURANTID = url.searchParams.get("restaurantid");

  var post_body = {
                      restaurant_id:   RESTAURANTID,
                      description:     description,
                      noise:           noiseRating,
                      rating_overall:  ratings[0].value,
                      rating_food:     ratings[1].value,
                      rating_service:  ratings[2].value,
                      rating_ambience: ratings[3].value,
                      rating_value:    ratings[4].value,
                      name_display:    ratings[5].value,
                    };
  // console.log(post_body);

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      document.getElementById("reviews").innerHTML = "";
      getReviews();
    }
    else if (this.readyState == 4 & this.status == 403) {
      alert("Please log in to leave a review");
    }
  };

  xhttp.open("POST", "/users/addUserReview", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(post_body));
}

function confirmBookingDetails() {
  // Create new AJAX request
  var xhttp = new XMLHttpRequest();

  // Handle response
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      var date = document.getElementById("datePicker").value;
      document.getElementById("dateCB").innerHTML = " " + date;

      var time = document.getElementById("timePicker").value;
      document.getElementById("timeCB").innerHTML = " " + time;

      var people = document.getElementById("peopleSelector").value;
      document.getElementById("guestsCB").innerHTML = " " + people + " people";

      if (this.status == 200 || this.status == 201) {
        document.getElementById("removeIfLoggedIn").style.display = 'none';
        document.getElementById("confirmEmail").style.display = 'none';
      }
      else {
        document.getElementById("removeIfLoggedIn").style.display = '';
        document.getElementById("confirmEmail").style.display = '';
      }
    }
  };

  // Open connection
  xhttp.open("GET", "users/isLoggedIn", true);

  xhttp.send();
}

// confirms the reservation
function confirmReservation() {
  reserveWithoutAccount();
}

// sends the reservation details to the server and returns a booking ID for a logged in user.
function reserveWithAccount() {
  var url = new URL(window.location.href);
  const restaurantid = url.searchParams.get("restaurantid");
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;
  const people = document.getElementById("peopleSelector").value;
  const phone = document.getElementById("phonenumber").value;
  const email = document.getElementById("email").value;
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const additionalInformation = document.getElementById("additionalInformation").value;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      // console.log(this.responseText);
      document.getElementById("bookingid").innerHTML = this.responseText;
      document.getElementById("insertEmail").innerHTML = email;
    }
  };

  var bookingInfo = URI('users/addBooking');
  var query = bookingInfo.query(true);
  query.restaurant_id = restaurantid;
  query.date = date;
  query.time = time;
  query.name_first = firstName;
  query.name_last = lastName;
  query.phone_number = phone;
  query.numguests = people;
  query.additionalInformation = additionalInformation;
  bookingInfo.query(query);

  xhttp.open("GET", bookingInfo, true);
  xhttp.send();
}

// sends the reservation details to the server and returns a booking ID for a non-logged in user.
function reserveWithoutAccount() {
  var url = new URL(window.location.href);
  const restaurantid = url.searchParams.get("restaurantid");
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;
  const people = document.getElementById("peopleSelector").value;
  const phone = document.getElementById("phonenumber").value;
  const email = document.getElementById("email").value;
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const additionalInformation = document.getElementById("additionalInformation").value;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      // console.log(this.responseText);
      document.getElementById("bookingid").innerHTML = this.responseText;
      document.getElementById("insertEmail").innerHTML = email;
    }
  };

  var bookingInfo = URI('/addBooking');
  var query = bookingInfo.query(true);
  query.restaurant_id = restaurantid;
  query.date = date;
  query.time = time;
  query.name_first= firstName;
  query.name_last= lastName;
  query.phone_number = phone;
  query.numguests = people;
  query.additionalInformation = additionalInformation;
  bookingInfo.query(query);

  xhttp.open("GET", bookingInfo, true);
  xhttp.send();
}

// Populates the DOM HTML with the selected restaurant data (from server)
function populateDomElements(RESTAURANTDATA) {
  document.getElementById("breadcrumbName").innerHTML = RESTAURANTDATA.name;
  document.getElementById("restaurantName").innerHTML = RESTAURANTDATA.name;
  document.getElementById("nameCB").innerHTML = RESTAURANTDATA.name;
  document.getElementById("aboutInfo").innerHTML = RESTAURANTDATA.description;
  //document.getElementById("menuInfo").innerHTML = "Menu data";



  var address = JSON.parse(RESTAURANTDATA.address);
  document.getElementById("location").innerHTML = address.Street + ', ' + address.Suburb;

  for (var i = RESTAURANTDATA.images.length - 1; i >= 0; i--) {
    var imageURL = RESTAURANTDATA.images[i].img_url;
    var bigImageSection = document.getElementById("bigImageSection");
    var gridImageSection = document.getElementById("gridImageSection");

    // Creating large image IMG
    var bigImageDiv = document.createElement("DIV");
    bigImageDiv.className = "slides";
    var bigImageImg = document.createElement("IMG");
    bigImageImg.className = "bigImage";
    bigImageImg.src = imageURL;
    bigImageImg.alt = "picture of restaurant";
    bigImageDiv.appendChild(bigImageImg);

    bigImageSection.prepend(bigImageDiv);

    // Creating grid image IMG
    var gridImageDiv = document.createElement("DIV");
    gridImageDiv.className = "column";
    var gridImageImg = document.createElement("IMG");
    gridImageImg.className = "demo cursor smallImage";
    gridImageImg.alt = "small image of restaurant in grid";
    gridImageImg.src = imageURL;
    gridImageImg.setAttribute("onclick", "currentSlide("+String(i + 1)+")");
    gridImageDiv.appendChild(gridImageImg);

    gridImageSection.prepend(gridImageDiv);
  }

  currentSlide(1);

  // create new review section for each review
  // document.getElementById("reviewInfo").innerHTML = RESTAURANTDATA.reviews.join(); // replace this

  // rating, reviews, cuisine and cost info at top of page
  var cost = "";
  for (var j = 0; j < 2; j++) cost += "$";

  var rating = "";
  for (var i = 0; i < RESTAURANTDATA.overall_rating; i++) rating += "<i class=\"far fa-star\"></i>";

  var numberOfReviews = RESTAURANTDATA.review_count;
  var cuisine = Object.keys(JSON.parse(RESTAURANTDATA.cuisine))[0];

  document.getElementById("topInfo").innerHTML = rating + " | " + numberOfReviews + " reviews | " + cuisine + " | " + cost;
}

function populateFields() {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      RESTAURANTDATA = JSON.parse(this.responseText);
      populateImages();
    }
  };

  var url = new URL(window.location.href);
  const RESTAURANTID = url.searchParams.get("restaurantid");

  var restaurantSelection = URI('/restaurantPage.json');
  var query = restaurantSelection.query(true);
  query.restaurant_id = RESTAURANTID;
  restaurantSelection.query(query);

  xhttp.open("GET", restaurantSelection, true);
  xhttp.send();
}

function populateImages() {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      RESTAURANTDATA.images = JSON.parse(this.responseText);
      // console.log(RESTAURANTDATA);
      populateDomElements(RESTAURANTDATA);
    }
  };

  var url = new URL(window.location.href);
  const RESTAURANTID = url.searchParams.get("restaurantid");

  var restaurantSelection = URI('/restMenuImg.json');
  var query = restaurantSelection.query(true);
  query.restaurant_id = RESTAURANTID;
  restaurantSelection.query(query);

  xhttp.open("GET", restaurantSelection, true);
  xhttp.send();
}

var reviews = [];
function getReviews() {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 & this.status == 200) {
      reviews = JSON.parse(this.responseText);
      createReviewElements();
    }
  };

  var url = new URL(window.location.href);
  const RESTAURANTID = url.searchParams.get("restaurantid");

  var restaurantSelection = URI('/restReviews.json');
  var query = restaurantSelection.query(true);
  query.restaurant_id = RESTAURANTID;
  restaurantSelection.query(query);

  xhttp.open("GET", restaurantSelection, true);
  xhttp.send();
}
getReviews();

function createReviewElements() {
  var reviewSection = document.getElementById("reviews");

  for (var i = 0; i < reviews.length; i++) {
    var reviewDiv = document.createElement("DIV");
    reviewDiv.innerHTML = `
            <div class="row">
              <div id="username" class="col-2">
                <i class="icon far fa-user fa-3x"></i>
                <p>` + reviews[i].name_display + `</p>
              </div>
              <div class="col-8">
                <p id="topOfReview">Overall: ` + reviews[i].rating_overall +
                                    ` | Food: ` + reviews[i].rating_food +
                                    ` | Service: ` + reviews[i].rating_service +
                                    ` | Ambience: ` + reviews[i].rating_ambience +
                                    ` | Value: ` + reviews[i].rating_value +
                                    ` | Noise: ` + reviews[i].noise +
               `</p>
                <p> ` + reviews[i].description  + `</p>
                <hr>
              </div>
            </div>
      `
    reviewSection.appendChild(reviewDiv);
  }
}

// Slideshow functions
var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slides");
  var dots = document.getElementsByClassName("demo");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

