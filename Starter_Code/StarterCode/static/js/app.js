let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
let data_all;

d3.json(url).then(function (data) {
    
    //getting data
    console.log(data);
    data_all = data;
    //dropdown
    let dropdown = d3.select("#selDataset")

    for (let x = 0; x < data.names.length; x++){
        let name = data.names[x];
        dropdown.append("option").text(name);
    }

    //get person info
    let person = data.names[0];
    let person_info = data.samples.filter(row => row.id === person)[0];
    let meta = data.metadata.filter(row => row.id == person)[0];

    console.log(meta);

    //chart
    makeBarChart(person_info);
    makeBubbleChart(person_info);
    makeMetaData(meta);

});



//bar chart with data
function makeBarChart(person_info){
    let samples = person_info.sample_values.slice(0, 10).reverse();
    let otu_is = person_info.otu_ids.slice(0, 10).reverse();
    let otu_ls = person_info.otu_labels.slice(0,10).reverse();

    let trace = {
        x: samples,
        y: otu_is.map(id => `OTU ${id}`),
        text: otu_ls,
        type: "bar",
        orientation: "h"
    };

    let traces = [trace];

    let chart = {
        title: "The Top 10 OTU Values",
        xaxis: {title: "Value of the Samples"},
        yaxis: {title: "OTU ID's"}

    };
    Plotly.newPlot("bar", traces, chart);
}

//bubble chart with data
function makeBubbleChart(person_info) {
    let samples = person_info.sample_values;
    let otu_is = person_info.otu_ids;
    let otu_ls = person_info.otu_labels;
  
    let trace = {
      x: otu_is,
      y: samples,
      text: otu_ls,
      mode: "markers",
      marker: {
        color: otu_is,
        size: samples
      }
    };
  
    let traces = [trace];
  
    let chart = {
      title: "OTUs Observed",
      xaxis: { title: "OTU ID's" },
      yaxis: { title: "Value of the Samples" }
    };
  
    Plotly.newPlot("bubble", traces, chart);
  
  }
  
  //metadata
function makeMetaData(meta){
    let panel = d3.select("#sample-metadata");
    panel.html("");

    //read the keys of the dict

    let k = Object.keys(meta);
    for (let x = 0; x < k.length; x++){
        let key = k[x];
        panel.append("p").text(`${key}: ${meta[key]}`);        
    }
}
  //update with sample selection
  function updateSelected(person) {
    let person_info = data_all.samples.filter(row => row.id === person)[0];
    let meta = data_all.metadata.filter(row => row.id == person)[0];
  
    // make metadata, bar chart, and bubble chart
    makeMetaData(meta);
    makeBarChart(person_info);
    makeBubbleChart(person_info);
    
  }
  