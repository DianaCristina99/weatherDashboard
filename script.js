
        window.onload=function(){
        const api_key = "c7eedc2fa8594d69aa6122025212904";
        const inputCity = document.getElementById("inputCity");
        const getCity = document.querySelector("form");

        // *** Canvas colours ***
        
        // **********************

        getCity.addEventListener("submit", e =>{
            // Prevent the form from submission
            e.preventDefault();
            // Get city name and store it in local storage
            var inputVal = inputCity.value;
            var api_url = "http://api.weatherapi.com/v1/forecast.json?key=" + api_key + "&q=" + inputVal + "&days=3&aqi=no&alerts=no";
            // Get the dataset
            function refreshData() {
                fetch(api_url).then(response =>{
                    response.json().then(json => {
                        let dataset = json;
                        let output = formatResponse(dataset);
                    })
                    // Catch error - for example, the user doesn't input a valid city / postcode / country
                    .catch(error => console.log("not ok")); // TO BE IMPROVED
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
                
                refreshData(); // Display the dashboard immediately
                
                // setInterval(refreshData, 5000); // And then refresh the dashboard every X milliseconds
            
        
        });
        
            function formatResponse(dataset) {
                
                console.log(dataset);

				// Current temp
				var currentTemp = [dataset.current.temp_c];
				console.log(currentTemp);
                document.getElementById("currentTempDsp").innerHTML = currentTemp + "°";
                
                // Current state icon
                var currentIcon = [dataset.current.condition.icon];
                console.log(currentIcon);
                document.getElementById("iconDsp").src = "http://" + currentIcon;

                // Current state text
                var currentText = [dataset.current.condition.text];
                console.log(currentText[0]);
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
                console.log(currentCity);
                document.getElementById("currentCityDsp").innerHTML = currentCity + ", ";

                // Local current time
                var localDateTime = [dataset.location.localtime];
                var localDate = localDateTime.toString().slice(0,10);
                var localTime = localDateTime.toString().slice(10,16);
                document.getElementById("currentDateDsp").innerHTML = localDate;
                document.getElementById("currentTimeDsp").innerHTML = localTime;
                console.log(localDate);

                // Convent local time to number              
                var localTimeSplit = localTime.split(":");
                console.log(localTimeSplit);
                var localTimeHour = localTimeSplit[0];
                var localTimeInt = parseFloat(localTimeHour);
                console.log(localTimeInt);
                
                // Local sundown
                var sundown = [dataset.forecast.forecastday[0].astro.sunset.toString()];
                var sundownSplit = sundown.toString().split(":");
                console.log(sundownSplit);
                var sundownHour = sundownSplit[0];
                var sundownInt = parseFloat(sundownHour);

                // Convert sundown time
                var sundownMinutes = sundownSplit[1].includes("PM");
                if (sundownMinutes == true){
                    var sundownInt = sundownInt + 12;
                }
                console.log(sundownInt);


                // Local sunrise
                var sunrise = [dataset.forecast.forecastday[0].astro.sunrise.toString()];
                var sunriseSplit = sunrise.toString().split(":");
                console.log(sunriseSplit);
                var sunriseHour = sunriseSplit[0];
                var sunriseInt = parseFloat(sunriseHour);
                console.log(sunriseInt);
                
                // Current country
                var currentCity = [dataset.location.country];
                console.log(currentCity);
                document.getElementById("currentCountryDsp").innerHTML = currentCity;

				// Next 24 hour temperatures []
				let hourTemp = dataset.forecast.forecastday[0].hour.map(dataset => dataset.temp_c);
				console.log(hourTemp);

				// Next 24 hour date and time []
				let hourDateTime = dataset.forecast.forecastday[0].hour.map(dataset => dataset.time.toString().slice(11, 16));
				console.log(hourDateTime);

                // Max temps for the next 3 days []
				var temp3days = [dataset.forecast.forecastday[0].day.maxtemp_c, dataset.forecast.forecastday[1].day.maxtemp_c, dataset.forecast.forecastday[2].day.maxtemp_c];
				console.log(temp3days);



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

                    // Based on the weather state...

                    if(currentText.toString().includes('rain') == true) {
                        var background = "#9cb6ca";
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#EAEAEA";
                        var rain = "#ddd";
                    }
                    else if(currentText.toString().includes('Overcast') || currentText.toString().includes('cloud')) { // If the current state contains "Overcast" or "cloud"...
                        var background = "#aac7e8";
                        var circle = "transparent";
                        var cloud = "#EAEAEA";
                    }
                    else {
                        var background = "#5c9ce5";
                    }

                }
                else {
                    // It's night time
                    var shader = "#12192e";
                    var wall = "#65667c";
                    var windowsDark = "#3c465e";
                    var windowsLight = "#e7d7ba";
                    var white  = "#eee";
                    var background = "#1b2846";
                    var circle = "#ece2d0";
                    var cloud = "transparent";
                    var rain = "transparent";

                    // Based on the weather state...

                    if(currentText.toString().includes('rain') == true) { // If the current state contains "rain"...
                        var circle = "transparent"; // Hide the sun / moon
                        var cloud = "#374E81";
                        var rain = "#ccc";
                    }
                    else if(currentText.toString().includes('Overcast') || currentText.toString().includes('cloud')) { // If the current state contains "Overcast" or "cloud"...
                        var circle = "transparent";
                        var cloud = "#374E81";
                    }
                    else {
                        var background = "#1b2846";
                    }
                }

                function canvases() {

                    
                    
                    // Fill background canvas
                    ctx.fillStyle = background;
                    ctx.fillRect(0, 0, 1280, 700);

                    // Display current temperature, icon and text
                    /*
                    ctx.font = "80px Century Gothic";
                    ctx.fillStyle = white;
                    ctx.fillText(currentTemp + "°",135,140);
                    ctx.font = "15px Century Gothic";
                    ctx.fillText(currentText,145,181);
                    var img = new Image();
                    img.src = "http://" + currentIcon;
                    img.onload = function() {
                    ctx.drawImage(img, 100, 155, 40, 40);
                    }; */
                    
                    // cloud = new Image();
                    // cloud.src = 'img/cloud.png';
                    // cloud.onload = function(){
                    // ctx.drawImage(cloud, 140, 410, 200, 200);
                    // }

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
                    
                        // Arch traditional way - not enough args
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
                    }

                    function humidityChart(){
    
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

                    }

                    humidityChart();
                    canvases();
                    }


            }
				
                    // async function createChart(){

                    //     var ctx = document.getElementById('myChart').getContext('2d');
                    //     var myChart = new Chart(ctx,
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


				
                                  
        
