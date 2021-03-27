var NUM_PUBLISHERS = 5;
setChart(NUM_PUBLISHERS)
function setPub() {
    NUM_PUBLISHERS = document.getElementById("userPub").value;
    console.log(NUM_PUBLISHERS)
    setChart(NUM_PUBLISHERS)
  }

let svg2 = d3.select("#graph3")
  .append("svg")
  .attr("width", graph_3_width+margin.left+margin.right+10)     
  .attr("height", graph_3_height) 
  .append("g")
  .attr("transform", `translate(${graph_3_width/2+margin.left+10}, ${graph_3_height/2})`);



var pie = d3.pie()
let radius = Math.min(graph_3_width, graph_3_height) / 2 - margin.top
const path = d3.arc().outerRadius(radius*0.8).innerRadius(radius*0.5);

var outerCircle = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9)

function setChart (NUM_PUBLISHERS)
{   
    
    d3.csv("../data/video_games.csv").then(function(data) {
        let genre = []
        data.forEach(element => {
            if(!genre.includes(element.Genre))
            {
                genre.push(element.Genre)   
            }
    
        });

        d3.select("#selectButton")
        .selectAll('genres')
           .data(genre)
        .enter()
          .append('option')
        .text(function (d) { console.log(d); return d; }) 
        .attr("value", function (d) { return d; })
        
        getChart('Sports', data)
        d3.select("#selectButton")
        .on("change", function (d) {
            var selectedGenre = d3.select(this).property("value")
    
            getChart(selectedGenre, data)
        }) 
        
    });
}


function getChart(selectedGenre, data) {
    console.log(selectedGenre)
    var filteredData = data.filter(d => d.Genre == selectedGenre);
    var finaldata = getTop(filteredData, NUM_PUBLISHERS)
    console.log(finaldata)


    pie.value(d => d.totalSales);

    svg2
    .selectAll('.arc')
    .data(pie(finaldata))
    .enter()
    .append('path')
    .attr('d', path)
    .attr("fill", function(d) { return color(d.data.totalSales)});
    
 

    let allLines = svg2.selectAll('polylines')

    svg2.selectAll('polyline').remove()
    
    allLines
    .data(pie(finaldata))
    .enter()
    .merge(allLines)
    .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
        var position = outerCircle.centroid(d);
        position[0] = radius * 0.9 * (midAngle(d) < Math.PI ? 1 : -1);
        return [path.centroid(d), outerCircle.centroid(d), position]
        })
    .transition()
    .duration(1000)

    
    
    let allLabels = svg2.selectAll('labels')
    svg2.selectAll('text').remove()

    allLabels
    .data(pie(finaldata))
    .enter()
    .merge(allLabels)
    .append('text')
        .html(d => `${d.data.Publisher} , ${d.data.percentile}`)
        .attr('transform', function(d) {
            var position = outerCircle.centroid(d);
            position[0] = radius * 0.99 * (midAngle(d) < Math.PI ? 1 : -1);
            return 'translate('+position+')';
        })
        .style('text-anchor', function(d) {
            console.log(midAngle(d))
            return (midAngle(d) < Math.PI ? 'start' : 'end')
        })
        
}


function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function getTop(data, numPUB)
{
  
    var dataFilter = data
    let publisher = new Set()
    let res = []
    let sum = 0
    let index = 0

    dataFilter.forEach(function(element){
        if (!publisher.has(element.Publisher)) {  
            //console.log(element.Genre)
            publisher.add(element.Publisher)
            res[index] = {"Publisher": element.Publisher, "totalSales": 0.0, "percentile": 0.0}
            res[index].totalSales =  res[index].totalSales + parseFloat(element.NA_Sales) + parseFloat(element.EU_Sales)
             +  parseFloat(element.JP_Sales) + parseFloat(element.Other_Sales) + parseFloat(element.Global_Sales)
            //console.log(res[index].totalSales)
            index = index + 1   

        }
        else {
            
            var index1 = res.findIndex(p => p.Publisher == element.Publisher)

            res[index1].totalSales =  res[index1].totalSales + parseFloat(element.NA_Sales) + parseFloat(element.EU_Sales)
            +  parseFloat(element.JP_Sales) + parseFloat(element.Other_Sales) + parseFloat(element.Global_Sales)

        }
    })

    res.sort(function(x,y) {
        return parseInt(y.totalSales) - parseInt(x.totalSales)
    })

    let result = res.slice(0, numPUB)

    var allEleSales = []
    result.forEach(function(element){
        allEleSales.push(element.totalSales)
    })

    console.log(allEleSales)

    result.forEach(function(element){
        element.percentile = getPercentile(allEleSales,element.totalSales).toFixed(2)
    })



    return result
}


function getPercentile(res, value) {
    var initialValue =  res.reduce((accumulator, currentValue) => accumulator + (currentValue < value ? 1 : 0) + (currentValue === value ? 0.5 : 0), 0)
    var finalValue = (initialValue*100)/res.length
    console.log(finalValue)
    return finalValue
}