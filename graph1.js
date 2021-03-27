var slider = document.getElementById("inputYear");
var allTime = document.getElementById("allTime");
var output = document.getElementById("printYear");
output.innerHTML = slider.value
setData(slider.value)
slider.oninput = function() {
    output.innerHTML = slider.value
    setData(slider.value)
}
allTime.onclick = function() {
    setData('All time')
}

const NUM_EXAMPLES = 10 

let svg1 = d3.select("#barplot1")
.append("svg")
.attr("width", graph_1_width+margin.left)     
.attr("height", graph_1_height)     
.append("g")
.attr("transform", `translate(${margin.left+30}, ${margin.top})`);  


let chartTitle = svg1.append("text")
.attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)      
.style("text-anchor", "middle")
.style("font-size", 15)
.style("font-weight", "bold")

        
let xAxisTitle = svg1.append("text")
.attr("transform",  `translate(-150, ${(graph_1_height - margin.top - margin.bottom) / 2})  `)  
.style("text-anchor", "middle")
.style("font-weight", "bold")
.text("Games");

let yAxisTitle = svg1.append("text")
.attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
${(graph_1_height - margin.top - margin.bottom) + 40})`)     
.style("text-anchor", "middle")
.style("font-weight", "bold")
.text("Total Sales (in millions)");

let yAxisValues = svg1.append('g').style("font-size", "0.8em");
let xAxisValues = svg1.append('g').style("font-size", "1em")
let x = d3.scaleLinear().range([0, graph_1_width - margin.left - margin.right])
let y = d3.scaleBand().range([0, graph_1_height - margin.top - margin.bottom]).padding(0.1); 
let countRef = svg.append('g')

let color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateHcl("blue"/*"#66a0e2"*/, "yellow"), 10))

//let color = d3.scaleQuantize().domanin([0,10])
//["202155","39394d","535244","858332","999854","aead76","d5d5b9","595a92","9798bd","d5d5e8"]
var tooltip = d3.select("#barplot1")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid 1px")
.style("border-radius", "5px")
.style("padding", "5px")




function setData (userYear) {    
    d3.csv("../data/video_games.csv").then(function(data) {
        if(userYear=='All time')
        {
            data = getTopGames(userYear, data)
        }
        else {
            data = getTopGames(parseInt(userYear), data)
        }

        if(data!=null)
        {

        
        x.domain([0, d3.max(data, function(d) { return d.totalSales })]);
       

        y.domain(data.map(function(d) { return d.Name}));
        color.domain(data.map(function(d) { return d.totalSales }));

        let bars = svg1.selectAll("rect").data(data);
        yAxisValues.call(d3.axisLeft(y))
        xAxisValues.call(d3.axisBottom(x)).attr("transform", `translate(0, ${(graph_1_height-margin.top-margin.bottom)})`)
        

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr('y', function (d) { return y(d.Name)})
            .attr("width", function (d) { return x(d.totalSales)})
            .attr("height",  y.bandwidth())    
            .attr("fill", function(d) { return color(d.totalSales)}) 
            .on("mouseover", function(d) {      
                tooltip.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                tooltip .html(d.Name + "<br/>"  + d.totalSales)  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY) + "px");    
                })                  
            .on("mouseout", function(d) {       
                tooltip.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            })
            .transition();



        chartTitle.text("Top 10 Games of "+ userYear);

        bars.exit().remove()    
            
        }
       

    });
    
}

function getTopGames(userYear, data)
{
    if(userYear == 'All time')
    {
        var filteredData = data
    }
    else {
        var filteredData = data.filter(d => d.Year == userYear);
        if(filteredData.length == 0)
        {
            return null
        }
    }
    
    let gameNames = new Set()
    let res = []
    let sum = 0
    let index = 0

    filteredData.forEach(function(element) {
        if (!gameNames.has(element.Name)) {  
            gameNames.add(element.Name)
            res[index] = {"Name": element.Name, "totalSales": 0.0}
            res[index].totalSales =  res[index].totalSales + parseFloat(element.NA_Sales) + parseFloat(element.EU_Sales)
             +  parseFloat(element.JP_Sales) + parseFloat(element.Other_Sales) + parseFloat(element.Global_Sales)
            index = index + 1   

        }
        else {
            var index1 = res.findIndex(p => p.Name == element.Name)
            res[index1].totalSales =  res[index1].totalSales + parseFloat(element.NA_Sales) + parseFloat(element.EU_Sales)
            +  parseFloat(element.JP_Sales) + parseFloat(element.Other_Sales) + parseFloat(element.Global_Sales)

        }
    })

    res.sort(function(x,y) {
        return parseInt(y.totalSales) - parseInt(x.totalSales)
    })

    let result = res.slice(0, NUM_EXAMPLES)
    return result
}

