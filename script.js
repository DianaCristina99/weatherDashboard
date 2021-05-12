
        window.onload=function(){

        const api_key = "c7eedc2fa8594d69aa6122025212904";
        const inputCity = document.getElementById("inputCity"); // To get user input
        const getCity = document.querySelector("form"); // For event handling (form submit)
        var currentInterval = null;

        getCity.addEventListener("submit", e =>{ // When the user submits something...
            e.preventDefault(); // Prevent the form from submission
            var inputVal = inputCity.value; // Get city name
            // Api Url - containing the API key and the city inputted by the user
            var api_url = "http://api.weatherapi.com/v1/forecast.json?key=" + api_key + "&q=" + inputVal + "&days=3&aqi=no&alerts=no";
            
            function refreshData() {
                // Get the dataset
                fetch(api_url).then(response =>{
                    response.json().then(json => { 
                        var dataset = json; // Store the json data in a variable
                        formatResponse(dataset); // Use this function to get stuff from the dataset
                    })
                    // Catch error - for example, the user doesn't input a valid city / postcode / country
                    .catch(error => {
                        // Display the overlay after submit and inform the user there was an error
                        document.getElementById("labelCity").innerHTML = "Sorry, no location found";
                        document.getElementById("labelCity").style.display = "block";
                        document.getElementById("overlay").style.display = "block";
                        document.getElementById("getCity").classList.remove("after");
                        document.getElementById("inputCity").classList.remove("inpAfter");
                        document.getElementById("submitCity").classList.remove("sbmAfter");
                        document.getElementById("getCity").classList.add("search");
                    });
                })

            if (inputVal == "") { // If the user doesn't type anything...
                document.getElementById("inputCity").placeholder = 'Try searching for "London"...'; // Replace placeholder text with a city suggestion
                return false; // and don't run
            }
            else {
                // Hide overlay after submit
                document.getElementById("getCity").classList.add("after");
                document.getElementById("inputCity").classList.add("inpAfter");
                document.getElementById("submitCity").classList.add("sbmAfter");
                document.getElementById("getCity").classList.remove("search");
                document.getElementById("overlay").style.display = "none";
                document.getElementById("labelCity").style.display = "none";
            }

            // Fix bug where Chart.js doesn't want to update chart after a new city search
            function updateChart() {
                // Remove canvases and add them again, along with their unique IDs
                // This will update the canvases every time the user looks for a new city
                document.getElementById('chanceRainChart').remove();
                document.getElementById('humidityChart').remove();


                var chanceRainChart = document.createElement("canvas");
                chanceRainChart.id = "chanceRainChart";
                document.getElementById("chanceRain").appendChild(chanceRainChart);
                
                var humidityChart = document.createElement("canvas");
                humidityChart.id = "humidityChart";
                document.getElementById("humidity").appendChild(humidityChart); 
            }
            updateChart();

        }       
                if (currentInterval) {
                    clearInterval(currentInterval);
                    currentInterval = null;
                    console.log('Cleared currentInterval');
                } // If there was an interval, clear it

                refreshData(); // Display the dashboard immediately 

                // Set new interval after a new input
                currentInterval = setInterval(function () {
                refreshData();  
                }, 100000); // Refresh the dashboard every X milliseconds
                  
        });
        
            function formatResponse(dataset) {
                
                console.log(dataset);

				// Current temp
				var currentTemp = [dataset.current.temp_c];
                document.getElementById("currentTempDsp").innerHTML = currentTemp + "°";
                
                // Current state icon
                var currentIcon = [dataset.current.condition.icon];
                document.getElementById("iconDsp").src = "http://" + currentIcon;

                // Current state text
                var currentText = [dataset.current.condition.text];
                document.getElementById("currentStateDsp").innerHTML = currentText;

                // Current humidity
                var currentHum = [dataset.current.humidity];
                var restHum = 100 - currentHum;
                document.getElementById("humDsp").innerHTML = currentHum + "%";

                // Today's chance of rain
                var chanceRain = [dataset.forecast.forecastday[0].day.daily_chance_of_rain]; 
                var restRain = 100 - chanceRain;
                document.getElementById("chanceRainDsp").innerHTML = chanceRain + "%";

                // Current city
                var currentCity = [dataset.location.name];
                document.getElementById("currentCityDsp").innerHTML = currentCity + ", ";

                // Local current time
                var localDateTime = [dataset.location.localtime];
                var localDate = localDateTime.toString().slice(0,10);
                var localTime = localDateTime.toString().slice(10,16);
                document.getElementById("currentDateDsp").innerHTML = localDate;
                document.getElementById("currentTimeDsp").innerHTML = localTime;

                // Convent local time to number              
                var localTimeSplit = localTime.split(":");
                var localTimeHour = localTimeSplit[0];
                var localTimeInt = parseFloat(localTimeHour);
                
                // Local sundown
                var sundown = [dataset.forecast.forecastday[0].astro.sunset.toString()];
                var sundownSplit = sundown.toString().split(":");
                var sundownHour = sundownSplit[0];
                var sundownInt = parseFloat(sundownHour);

                // Convert sundown time
                var sundownMinutes = sundownSplit[1].includes("PM");
                if (sundownMinutes == true){
                    var sundownInt = sundownInt + 12;
                }


                // Local sunrise
                var sunrise = [dataset.forecast.forecastday[0].astro.sunrise.toString()];
                var sunriseSplit = sunrise.toString().split(":");
                var sunriseHour = sunriseSplit[0];
                var sunriseInt = parseFloat(sunriseHour);
                
                // Current country
                var currentCity = [dataset.location.country];
                document.getElementById("currentCountryDsp").innerHTML = currentCity;

				// Next 24 hour temperatures []
				let hourTemp = dataset.forecast.forecastday[0].hour.map(dataset => dataset.temp_c);

				// Next 24 hour date and time []
				let hourDateTime = dataset.forecast.forecastday[0].hour.map(dataset => dataset.time.toString().slice(11, 16));
                // Max temps for the next 3 days []
				var temp3days = [dataset.forecast.forecastday[0].day.maxtemp_c, dataset.forecast.forecastday[1].day.maxtemp_c, dataset.forecast.forecastday[2].day.maxtemp_c];



                var canvas = document.getElementById("backgroundCanvas"); // Link canvas to the script
                var ctx = canvas.getContext("2d"); // Define the context
                var m = Math.PI;

                // Determine whether it's night time or day time and set colour theme 
                if (localTimeInt > sunriseInt && localTimeInt < sundownInt) {
                    // It's day time
                    var shader = "#6a6a6a";
                    var wall = "#b4aca3";
                    var windowsDark = "#898989";
                    var windowsLight = "#d6d6d5";
                    var white  = "#eee";
                    var circle = "#ecb150";
                    var cloud = "transparent";
                    var rain = "transparent";
                    var snow = "transparent";
                    var blurPx = "blur(0)";

                    // If the current state of the weather includes the word...

                    if(currentText.toString().includes('rain') || currentText.toString().includes('drizzle')) {
                        var background = "#9cb6ca"; // Change background colour
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#EAEAEA"; // Show the cloud
                        var rain = "#ddd"; // Show the rain
                    }
                    else if(currentText.toString().includes('Overcast') || currentText.toString().includes('cloud') || currentText.toString().includes('Cloudy')) {
                        var background = "#aac7e8"; // Change background colour
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#EAEAEA"; // Show the cloud
                    }
                    else if(currentText.toString().includes('snow') || currentText.toString().includes('Snow') || currentText.toString().includes('sleet')) {
                        var background = "#9cb6ca"; // Change the background
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#EAEAEA"; // Show the cloud
                        var snow = "#ddd"; // Show the snow
                    }
                    else if(currentText.toString().includes('Mist')) {
                        var circle = "transparent"; // Hide the sun / moon
                        var background = "#aac7e8"; // Change the background
                        var blurPx = "blur(2.5px)"; // Blur the canvas
                    }
                    else if(currentText.toString().includes('fog') || currentText.toString().includes('Fog') ) {
                        var circle = "transparent"; // Hide the sun / moon
                        var background = "#aac7e8"; // Change the background
                        var blurPx = "blur(4px)"; // Blur the canvas
                    }
                    else {
                        var background = "#5c9ce5";
                        var blurPx = "blur(0)";
                    }

                }
                else {
                    // If the current state of the weather includes the word...
                    var shader = "#12192e";
                    var wall = "#65667c";
                    var windowsDark = "#3c465e";
                    var windowsLight = "#e7d7ba";
                    var white  = "#eee";
                    var background = "#1b2846";
                    var circle = "#ece2d0";
                    var cloud = "transparent";
                    var rain = "transparent";
                    var snow = "transparent";
                    var blurPx = "blur(0)";

                    // If the current state of the weather includes the word...

                    if(currentText.toString().includes('rain') || currentText.toString().includes('drizzle')) {
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#374E81"; // Show the cloud
                        var rain = "#ccc"; // Show the rain
                    }
                    else if(currentText.toString().includes('Overcast') || currentText.toString().includes('cloud') || currentText.toString().includes('Cloudy')) {
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#374E81"; // Show the cloud
                    }
                    else if(currentText.toString().includes('snow') || currentText.toString().includes('Snow') || currentText.toString().includes('sleet')) {
                        var circle = "transparent"; // Hide the sun
                        var cloud = "#EAEAEA"; // Show the cloud
                        var snow = "#ccc"; // Show the snow
                    }
                    else if(currentText.toString().includes('Mist')) {
                        var circle = "transparent"; // Hide the sun / moon
                        var blurPx = "blur(2.5px)"; // Blur the canvas
                    }
                    else if(currentText.toString().includes('fog') || currentText.toString().includes('Fog') ) {
                        var circle = "transparent"; // Hide the sun / moon
                        var blurPx = "blur(4px)"; // Blur the canvas
                    }
                    else {
                        var background = "#1b2846";
                        var blurPx = "blur(0)";
                    }
                }

                function canvases() {
                   
                    // Fill background canvas
                    ctx.fillStyle = background;
                    ctx.fillRect(0, 0, 1280, 700);
                    ctx.filter = blurPx; // Blur the canvas (using this when it's misty or foggy)

                    function makeRect(x, y, z, a, fill) { // => We will be adding our custom values here later
                        ctx.beginPath(); // Start drawing
                        ctx.rect(x, y, z, a, fill); // Make rectangle with unset values
                        ctx.fillStyle = fill; // Fill rectangles with an unset colour
                        ctx.fill(); // Fill it
                    }
                    
                    // Circle function
                    
                    function makeArc(x, y, r, sA, eA, fill) { // => We will be adding our custom values here later
                        ctx.beginPath(); // Start drawing
                        ctx.arc(x, y, r, sA, eA, fill); // Make circle with unset values
                        ctx.fillStyle = fill;
                        ctx.fill();
                    }
                    makeArc(140, 450, 70, 2 * m, false, circle); // Sun

                    // Cloud
                    makeArc(120, 460, 30, 0,  2 * m, cloud); 
                    makeArc(158, 440, 35, 0,  2 * m, cloud); 
                    makeArc(200, 445, 30, 0,  2 * m, cloud);
                    makeArc(230, 465, 25, 0,  2 * m, cloud);
                    makeArc(130, 490, 33, 0,  2 * m, cloud);
                    makeArc(170, 495, 31, 0,  2 * m, cloud);
                    makeArc(210, 495, 26, 0,  2 * m, cloud);

                    // Rain drops
                    ctx.beginPath();
                    ctx.moveTo(210, 530);
                    ctx.lineTo(195, 550);

                    ctx.moveTo(190, 530);
                    ctx.lineTo(175, 550);

                    ctx.moveTo(170, 530);
                    ctx.lineTo(155, 550);
                    
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = rain;
                    ctx.stroke();

                    // Snowflakes
                    makeArc(170, 540, 4, 0,  2 * m, snow); 
                    makeArc(180, 560, 4, 0,  2 * m, snow);
                    makeArc(190, 540, 4, 0,  2 * m, snow);
                    makeArc(200, 560, 4, 0,  2 * m, snow);  
                    makeArc(210, 540, 4, 0,  2 * m, snow);  

                    // Buildings              
                    makeRect(0, 270, 70, 500, wall); // Block
                    
                    // Second building Left Balconies
                    var yCoordinate  = 340;
                    
                        for (var i = 1; i <= 30; i++){
                        makeRect(0, yCoordinate , 28, 10, windowsDark);
                        yCoordinate  = yCoordinate  + 15;
                        }
                    
                    // Short Windows
                    
                    var yCoordinate  = 280;
                    
                        for (var i = 1; i <= 27; i++){
                        makeRect(45, yCoordinate , 25, 10, windowsLight);
                        yCoordinate  = yCoordinate  + 20;
                        }
                    
                        // Arch traditional way - not enough args in makeArc()
                        ctx.beginPath(); // Start drawing
                        ctx.arc(12, 270, 50, 1 * m, false); // Make circle with unset values
                        ctx.fillStyle = shader;
                        ctx.fill();
                                       
                    // LAST BUILDING
                    
                    // First Block
                    
                    makeRect(130, 510, 30, 560, shader); // Narrow Block
                    
                    // Left Windows
                    
                    var yCoordinate  = 525;
                    
                        for (var i = 1; i <= 26; i++){
                        makeRect(135, yCoordinate , 20, 9, windowsDark);
                        yCoordinate  = yCoordinate  + 22;
                        }
                    
                    makeRect(70, 450, 60, 650, wall); // Thick Block
                    makeRect(84, 670, 30, 300, shader); // Connecter Block
                    makeRect(90, 370, 8, 80, windowsDark); // Top Narrow Dark Block 
                    makeRect(100, 370, 8, 80, wall); // Top Narrow Light Block 
                    
                    // Long Windows
                    
                    makeRect(83, 500, 8, 80, windowsDark);
                    makeRect(108, 500, 8, 80, windowsDark);

                    makeRect(160, 590, 40, 650, wall); // Thick Block

                    var yCoordinate  = 600;
                    
                        for (var i = 1; i <= 26; i++){
                        makeRect(180, yCoordinate , 20, 9, windowsDark);
                        yCoordinate  = yCoordinate  + 22;
                        }
                    

                    // Change the colour of the icons based on the weather state / time of the day
                    var icons = document.getElementsByClassName('icon'); // Get all the icons
                    for (var i = 0; i < icons.length; i++) {
                        icons[i].style.color = background;
                        icons[i].style.border = "2px solid" + background;
                    }
                }

                    function charts(){
    
                        var ctx = document.getElementById('humidityChart').getContext('2d');
                        var humidityChart = new Chart(ctx,
                        {
                            type: 'doughnut',
                            data:
                            {
                                datasets: [
                                {
                                    label: '',
                                    data: [currentHum, restHum],
                                    fill: true,
                                    backgroundColor: [background,white],
                                    borderColor: [background],
                                    weight: 1,
                                    borderWidth: 1
                                }]
                            },
                            options:
                            
                            {
                            }
                        });
                        

                        var ctx = document.getElementById('chanceRainChart').getContext('2d');

                        var rainChart = new Chart(ctx,
                            {
                                type: 'doughnut',
                                data:
                                {
                                    datasets: [
                                    {
                                        label: '',
                                        data: [chanceRain, restRain],
                                        fill: true,
                                        backgroundColor: [background,white],
                                        borderColor: [background],
                                        weight: 1,
                                        borderWidth: 1
                                    }]
                                },
                                options:
                                
                                {
                                }
                            });

                            //     var ctx = document.getElementById('hourChart').getContext('2d');
                            //     var hourChart = new Chart(ctx,
                            //     {
                            //         type: 'line',
                            //         data:
                            //         {
                            //             labels: hourDateTime,
                            //             datasets: [
                            //             {
                            //                 label: '# of Votes',
                            //                 data: hourTemp,
                            //                 fill: true,
                            //                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            //                 borderColor: [
                            //                     'rgba(255, 99, 132, 1)'
                            //                 ],
                            //                 borderWidth: 1
                            //             }]
                            //         },
                            //         options:
                            //         {
                            //             scales:
                            //             {
                            //                 y:
                            //                 {
                            //                     max: 50,
                            //                     ticks:
                            //                     {
                            //                         // Include a dollar sign in the ticks
                            //                         callback: function (value, index, values)
                            //                         {
                            //                             return value + '°C';
                            //                         }
                            //                     }
                            //                 }
                            //             }
                            //         }
                            //     });
                            // }

                    }

                    charts();
                    canvases();
                    }


            }
				
                    


				
                                  
        
