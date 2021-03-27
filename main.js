// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

const svg = d3.select('svg').attr('width', '960').attr('height', 500);

const projection = d3.geoEquirectangular();
const pathGenerator = d3.geoPath().projection(projection);

Promise.all([
    d3.csv('../data/video_games.csv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json'),
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
]).then(([data, jsonData1, tsvData]) => {
    const finalData = {}
    let index = 0
    const countryName = {}

    tsvData.forEach(d => {
        countryName[d.iso_n3]= {"name": d.name, "continent": d.continent}
    })


    const countries = topojson.feature(jsonData1, jsonData1.objects.countries)


    svg.selectAll(".countries")
      .data(countries.features)
      .enter()
      .append("path")     
      .attr("d", d3.geoPath().projection(projection))
      .attr("fill", d => {
        if (countryName[d.id].continent == "North America") {
            console.log(countryName[d.id].continent )
            var nA_top = getTopGenre(data,'NA_Sales')
            return getColor(nA_top)
          }
          
          
        else if (countryName[d.id].name == "Japan" && countryName[d.id].continent == "Asia") {
            var nJP_top = getTopGenre(data,'JP_Sales')
            return getColor(nJP_top)
          }
          
        else if (countryName[d.id].continent == "Europe") {
            var nEU_top = getTopGenre(data,'EU_Sales')
            return getColor(nEU_top)
          }
        else if (countryName[d.id].name != "Japan" && countryName[d.id].continent == "Asia") {
            var nOT_top = getTopGenre(data,'Other_Sales')
            return getColor(nOT_top)
          }  
        else if (countryName[d.id].continent != "Antarctica") {
            var nOT_top = getTopGenre(data,'Other_Sales')
            return getColor(nOT_top)
        }
    
      }) 
      .attr('class', 'continent')

    svg.append("text").attr("x", 100).attr("y", 20).text("Globally, " + getTopGenre(data, 'Global_Sales') + " has the highest sales").style("font-size", "17px").style("font-weight", "bold").attr("alignment-middle","start")
    svg.append("text").attr("x", 5).attr("y", 300).text("Legend:").style("font-size", "20px").style("font-weight", "bold").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx",20).attr("cy",320).attr("r", 6).style("fill", "yellow")
    svg.append("circle").attr("cx",20).attr("cy",340).attr("r", 6).style("fill", "blue")
    svg.append("circle").attr("cx",20).attr("cy",360).attr("r", 6).style("fill", "pink")
    svg.append("circle").attr("cx",20).attr("cy",380).attr("r", 6).style("fill", "red")
    svg.append("circle").attr("cx",20).attr("cy",400).attr("r", 6).style("fill", "violet")
    svg.append("circle").attr("cx",20).attr("cy",420).attr("r", 6).style("fill", "purple")

    svg.append("circle").attr("cx",150).attr("cy",320).attr("r", 6).style("fill", "green")
    svg.append("circle").attr("cx",150).attr("cy",340).attr("r", 6).style("fill", "gray")
    svg.append("circle").attr("cx",150).attr("cy",360).attr("r", 6).style("fill", "lightblue")
    svg.append("circle").attr("cx",150).attr("cy",380).attr("r", 6).style("fill", "coral")
    svg.append("circle").attr("cx",150).attr("cy",400).attr("r", 6).style("fill", "brown")
    svg.append("circle").attr("cx",150).attr("cy",420).attr("r", 6).style("fill", "chartreuse")


    svg.append("text").attr("x", 40).attr("y", 320).text("Action").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 40).attr("y", 340).text("Role-Playing").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 40).attr("y", 360).text("Sports").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 40).attr("y", 380).text("Platform").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 40).attr("y", 400).text("Puzzle").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 40).attr("y", 420).text("Misc").style("font-size", "15px").attr("alignment-baseline","middle")

    svg.append("text").attr("x", 170).attr("y", 320).text("Racing").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 170).attr("y", 340).text("Fighting").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 170).attr("y", 360).text("Adventure").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 170).attr("y", 380).text("Strategy").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 170).attr("y", 400).text("Shooter").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 170).attr("y", 420).text("Simulation").style("font-size", "15px").attr("alignment-baseline","middle")
 
       
       
})


function getTopGenre(data, region) {
    console.log(region)
    //get the top data for each genre
    let res = []
    let genre = new Set()
    let index = 0
    data.forEach(function(element) {
        if (!genre.has(element.Genre)) {  
            genre.add(element.Genre)
            res[index] = {"Genre": element.Genre, "totalSales": 0.0}
            res[index].totalSales =  res[index].totalSales + parseFloat(element[region])
            index = index + 1   

        }
        else {
            var index1 = res.findIndex(p => p.Genre == element.Genre)
            res[index1].totalSales = res[index1].totalSales + parseFloat(element[region])
        }
    })
    res.sort(function(x,y) {
        return parseInt(y.totalSales) - parseInt(x.totalSales)
    })
    console.log(res)
    return res[0].Genre
}


function getColor(topGenre)
{
    if(topGenre=="Action")
    {
        return "yellow"
    }

    else if(topGenre=="Role-Playing")
    {
        return "blue"
    }

    else if(topGenre=="Sports")
    {
        return "green"
    }
}