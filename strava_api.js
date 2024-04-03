



const most_recent_activity = document.querySelector(".most_recent_activity");
const total_distance = document.querySelector(".total_distance");
const weighted_hr = document.querySelector(".weighted_hr");

var totalTime = 0;

var map = L.map('map').setView([43.907664, -69.964436], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/**
 * Helper function to get the accessToken using the refreshToken.
 * @returns the current accessToken.
 */
async function getAccessToken() {
  const myHeaders = new Headers();
  myHeaders.append("Cookie", "_strava4_session=m2ff4v6hkor8bg2q44b9o3h0t48c5mc6");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://www.strava.com/oauth/token?client_id=123837&client_secret=73c6f6d6578077e976d77d5f3daf477a2326b2ff&refresh_token=c17398f83e1e22da3c958c140a0edfff47d7d1a7&grant_type=refresh_token", requestOptions);
    const result = await response.json();
    const accessToken = result.access_token;
    return accessToken;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it
  }
}

/**
 * Helper function to return an array of specified length of my strava activities
 * 
 * @param {int} num the amount of activities in the array.
 * @returns an array containing all the specified number of most recent activity objects
 */
async function getActivities(num) {
  const accessToken = await getAccessToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Cookie", "_strava4_session=m2ff4v6hkor8bg2q44b9o3h0t48c5mc6");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://www.strava.com/api/v3/athlete/activities?page=1&per_page=" + num, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it
  }
}

/**
 * Helper function to return an array of all of my strava activities.
 * 
 * @returns an array containing all of the activity objects
 */
async function getAllActivities() {
  const accessToken = await getAccessToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Cookie", "_strava4_session=m2ff4v6hkor8bg2q44b9o3h0t48c5mc6");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    var data = [];
    var page = 1;
    var responseData;
    do {
      const response = await fetch("https://www.strava.com/api/v3/athlete/activities?page=" + page + "&per_page=200", requestOptions);
      responseData = await response.json();
      data = data.concat(responseData);
      page++;
    } while(responseData.length > 0) 
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it
  }
}

/**
 * Displays the name of my most recent activity
 */
async function displayMostRecentActivity() {
  try {
    const activities = await getActivities(1);
    most_recent_activity.textContent = activities[0].name;
  } catch (error) {
    console.error(error);
    // Handle error if necessary
  }
}


async function displayTotalDistance() {
  try {
    const activities = await getAllActivities();
    let totalDist = 0;
    for (let i = 0; i < activities.length; i++) {
      totalDist += activities[i].distance;
    }
    total_distance.textContent = (totalDist * 0.000621371).toFixed(0);
  } catch (error) {
    console.error(error);
    // Handle error if necessary
  }
}

/**
 * Calculates and displays the weighted heart rate for the most recent activities. 
 * 
 * @param {int} num the number of activities to calculate the weighted HR from.
 */
async function displayWeightedHeartRate(num) {
  try {
    const activities = await getActivities(num);
    let weightedHeartRateTotal = 0;
    for (let i = 0; i < activities.length; i++) {
      totalTime += activities[i].elapsed_time;
      weightedHeartRateTotal += activities[i].average_heartrate * activities[i].elapsed_time;
    }
    let avgHR = weightedHeartRateTotal / totalTime;
    weighted_hr.textContent = avgHR.toFixed(1);
  } catch (error) {
    console.error(error);
    // Handle error if necessary
  }
}

/**
 * Displays the most recent activities on the map.
 * 
 * @param {int} num the number of activities being displayed.
 */
async function displayActivityPath(num) {
  try {
    const activities = await getActivities(num);
    console.log(activities); // For debugging purposes
    for (let i = 0; i < activities.length; i++) {
      var activity = activities[i];
      var activityMapData = activity.map.summary_polyline;
      var coordinates = L.Polyline.fromEncoded(activityMapData).getLatLngs();
      console.log(coordinates);

      L.polyline(
        coordinates, 
        {
          color: getColor(activity),
          weight: 5,
          opacity: 0.7,
          lineJoin: "round"
        }
      ).addTo(map)
    }
  } catch (error) {
    console.error(error);
    // Handle error if necessary
  }
}

/**
 * Helper function to generate the color based on the activity data.
 * @param {*} activity the strava activity for the path.
 * @returns a hexcode representation of the color to be displayed.
 */
function getColor(activity) {
  let red = 0;
  let green = 0;
  let blue = 0;

  if (activity.type == "Ride") {
    red = 255;
  }

  if (activity.type == "Run") {
    blue = 255
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
 
  return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}

displayMostRecentActivity();
displayTotalDistance(100);
displayWeightedHeartRate(30);

displayActivityPath(100);
