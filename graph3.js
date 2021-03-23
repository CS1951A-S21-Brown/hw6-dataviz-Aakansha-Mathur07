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
    .text(function (d) { return d; }) 
    .attr("genreName", function (d) { return d; })
    
    setSports(data)


    d3.select("#selectButton")
    .on("change", function (d) {
        var selectedGenre = d3.select(this).property("genreName")

        update(selectedGenre)
    }) 

    function update () {
        console.log('Hi')
        
    }
    
   // function setPie () {
});

function setSports(data) {
    console.log(data)
    console.log('Hello')
    let svg = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)     
    .attr("height", graph_3_height) 
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var data = getTop('Sports', data)
    //data = [{name: 'Abc', value: 40}, {name: 'Bcd', value:50}, {name:'Yo', value:15},{name:'Bd', value:100}]; 
    
    let countRef = svg.append("g");
    const radius = 100;
    let color = d3.scaleOrdinal(['red','blue','green','gray']);
    const pie = d3.pie().value(d => d.totalSales);

    
    const path = d3.arc().outerRadius(radius).innerRadius(0);

    const pies = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class','arc');

    pies.append('path').attr('d', path).attr("fill", function(d) { return color(d.value)})
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    }


function getTop(genreValue, data)
{
    console.log("Reached")
    console.log(genreValue)
    var dataFilter = data.filter(d => d.Genre == genreValue);
    let publisher = new Set()
    let res = []
    let sum = 0
    let index = 0
    console.log(dataFilter)
    dataFilter.forEach(function(element){
        if (!publisher.has(element.Publisher)) {  
            //console.log(element.Genre)
            publisher.add(element.Publisher)
            res[index] = {"Publisher": element.Publisher, "totalSales": 0.0}
            res[index].totalSales =  res[index].totalSales + parseFloat(element.NA_Sales) + parseFloat(element.EU_Sales)
             +  parseFloat(element.JP_Sales) + parseFloat(element.Other_Sales) + parseFloat(element.Global_Sales)
            //console.log(res[index].totalSales)
            index = index + 1   

        }
        else {
            console.log(element.Publisher)
            var index1 = res.findIndex(p => p.Publisher == element.Publisher)
            console.log(index1)
            res[index1].totalSales =  res[index1].totalSales + parseFloat(element.NA_Sales) + parseFloat(element.EU_Sales)
            +  parseFloat(element.JP_Sales) + parseFloat(element.Other_Sales) + parseFloat(element.Global_Sales)

        }
    })

    console.log(res)

    return res
    //var dataFilter = data.map(function(d){return {time: d.NA_Sales, genreValue:d[genreValue]} })


}