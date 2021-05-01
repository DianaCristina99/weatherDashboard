
        var api_key = "c7eedc2fa8594d69aa6122025212904";
		var city = "Preston";

		var api_url = "http://api.weatherapi.com/v1/forecast.json?key=" + api_key + "&q=" + city + "&days=3&aqi=no&alerts=no";
		var btn = document.getElementById("btn");
        // *** Canvas colours ***
        var backgroundBlue = "#12242f";
        var shader = "#6a6a6a";
        var wall = "#b4aca3";
        var windowsDark = "#898989";
        var windowsLight = "#d6d6d5";
        var white  = "#eee";
        var background = "#5c9ce5";
        // **********************
		"use strict";
		fetch(api_url)
			.then(function (resp)
			{
				return resp.json();
			})
			.then(function (dataset)
			{
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

                // Max temps for the next 3 days
				var temp3days = [dataset.forecast.forecastday[0].day.maxtemp_c, dataset.forecast.forecastday[1].day.maxtemp_c, dataset.forecast.forecastday[2].day.maxtemp_c];
				console.log(temp3days);
                
                chanceRainChart()
				humidityChart();
                backgroundCanvas();
                createChart();
                


                async function backgroundCanvas() {

                    var canvas = document.getElementById("backgroundCanvas"); // Link canvas to the script
                    var ctx = canvas.getContext("2d"); // Define the context
                    var m = Math.PI;
                    
                    // Fill canvas
                    // ctx.filter = 'brightness(160%) contrast(1) grayscale(5)';
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
                    
                    makeArc(140, 450, 70, 2 * m, false, "#ecb150"); // Sun
                    
                    
                    
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
                    
                    makeArc(12, 270, 50, 1 * m, false, 0, windowsLight); // Arch
                    
                    // Fill arch with gradient
                    
                    // Ref: https://www.w3schools.com/graphics/canvas_gradients.asp
                    
                    var grd = ctx.createLinearGradient(575, 200, 760, 200); // Create gradient with these positions and dimensions
                    grd.addColorStop(0, shader); // Left colour
                    grd.addColorStop(1, windowsLight); // Right colour
                    ctx.fillStyle = grd; // Fill shape with gradient
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
                    makeRect(90, 370, 8, 80, shader); // Top Narrow Dark Block 
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

                    async function humidityChart(){

                        var ctx = document.getElementById('humidityChart').getContext('2d');
                        var myChart = new Chart(ctx,
                        {
                            type: 'doughnut',
                            data:
                            {
                                datasets: [
                                {
                                    label: '',
                                    data: [currentHum, restHum],
                                    fill: true,
                                    backgroundColor: ['#5c9ce5','#EEE'],
                                    borderColor: [
                                        '#5c9ce5',
                                        '#5c9ce5'
                                    ],
                                    weight: 1,
                                    borderWidth: 1
                                }]
                            },
                            options:
                            
                            {
                            }
                        });
                    }

                    async function chanceRainChart(){

                        var ctx = document.getElementById('chanceRainChart').getContext('2d');
                        var myChart = new Chart(ctx,
                        {
                            type: 'doughnut',
                            data:
                            {
                                datasets: [
                                {
                                    label: '',
                                    data: [chanceRain, restRain],
                                    fill: true,
                                    backgroundColor: ['#5c9ce5','#EEE'],
                                    borderColor: [
                                        '#5c9ce5',
                                        '#5c9ce5'
                                    ],
                                    weight: 1,
                                    borderWidth: 1
                                }]
                            },
                            options:
                            
                            {
                            }
                        });
                    }
                    async function createChart(){

                        var ctx = document.getElementById('myChart').getContext('2d');
                        var myChart = new Chart(ctx,
                        {
                            type: 'line',
                            data:
                            {
                                labels: hourDateTime,
                                datasets: [
                                {
                                    label: '# of Votes',
                                    data: hourTemp,
                                    fill: true,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options:
                            {
                                scales:
                                {
                                    y:
                                    {
                                        max: 50,
                                        ticks:
                                        {
                                            // Include a dollar sign in the ticks
                                            callback: function (value, index, values)
                                            {
                                                return value + '°C';
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                });



				
	
        
