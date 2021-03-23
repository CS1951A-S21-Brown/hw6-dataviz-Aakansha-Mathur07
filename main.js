// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let salesNames = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Global_Sales']
function setData () {// Set up width and height for barplot
   
    
    let svg = d3.select("#graph2")
        .append("svg")
        .attr("width", graph_2_width)    
        .attr("height", graph_2_height)     
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    
    // Set up reference to count SVG group
    let countRef = svg.append("g");
    
    
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method
    d3.csv("../data/video_games.csv").then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        
        data = cleanData(data); 
        console.log("Here")
        console.log(data);
    
        // TODO: Create a linear scale for the x axis (number of occurrences)
        let x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.totalSales })])
            .range([0, graph_2_width - margin.left - margin.right]);

        // TODO: Create a scale band for the y axis (artist)
        let y = d3.scaleBand()  
            .domain(data.map(function(d) { return d['Genre']}))
            .range([0, graph_2_height - margin.top - margin.bottom])
            .padding(0.1);  // Improves readability
    
        // TODO: Add y-axis label
        svg.append("g")
            .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg.selectAll("rect").data(data);
    
        // OPTIONAL: Define color scale
        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d["Genre"] }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));
    
    
        console.log(data['artist'])
        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", function(d) { return color(d.Genre)}) //function(data) { return color(data['artists']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
            .attr("x", x(0))
            .attr("y", function(d) { return y(d.Genre)})              // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
            .attr("width", function(d) {return x(d.totalSales)})
            .attr("height",  y.bandwidth());    
                // HINT: y.bandwidth() makes a reasonable display height

        let counts = countRef.selectAll("text").data(data);
    
        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .attr("x", function(d) { return x(d.totalSales)})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d) { return y(d.Genre)})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) { return (d.totalSales)});           // HINT: Get the count of the artist
    
    
        // TODO: Add x-axis label
        svg.append("text")
            .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
            ${(graph_2_height - margin.top - margin.bottom) + 30})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
            .style("text-anchor", "middle")
            .text("Count");
    
        // TODO: Add y-axis label
        svg.append("text")
            .attr("transform",  `translate(-80, ${(graph_2_height - margin.top - margin.bottom) / 2})  `)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
            .style("text-anchor", "middle")
            .text("Artist");
    
        // TODO: Add chart title
        svg.append("text")
            .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-20})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .text("Top Artists in Billboard 100 Charts");
    });
    
    /**
     * Cleans the provided data using the given comparator then strips to first numExamples
     * instances
     */
    
 }
function cleanData(data) {
        console.log("REACHED")
        let genre = new Set()
        let res = []
        let sum = 0
        let index = 0
        
        data.forEach( function(element) {
            if (!genre.has(element.Genre)) {  
                //console.log(element.Genre)
                genre.add(element.Genre)
                res[index] = {"Genre": element.Genre, "totalSales": 0.0}
                res[index].totalSales =  res[index].totalSales + parseFloat(element.NA_Sales)
                //console.log(res[index].totalSales)
                index = index + 1   

            }
            else {
                console.log(element.Genre)
                var index1 = res.findIndex(p => p.Genre == element.Genre)
                console.log(index1)
                res[index1].totalSales = res[index1].totalSales + parseFloat(element.NA_Sales)
            }
        })
        
        console.log(res.Sports)
        res.forEach(function (d) {
            console.log("HERE HERE")
            console.log(d.totalSales)     
        })

        res.sort(function(x,y) {
            return parseInt(y.totalSales) - parseInt(x.totalSales)
        })
    
    

        return res
}

    