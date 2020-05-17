function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  })
}

init();
optionChanged(940);

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

//Populate panel with subject's attributes
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) =>{
      PANEL.append("h6").text(key + " : " + value);
    });
   
//Create wfreq Gauge chart
    var gaugedata = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: result.wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        gauge: {
          axis: { range: [null, 10],},
          bar: { color: "rgb(42,60,180)"},
          steps: [
            { range: [0, 1], color: 'rgb(250, 100, 130)' },
            { range: [1,2], color: 'rgb(250, 165, 100)' },
            { range: [2,4], color: "rgb(250, 250, 35)" },
            { range: [4,6], color: "rgb(250, 230, 100)" },
            { range: [6,8], color: "rgb(215, 250, 100)" },
            { range: [8,10], color: "rgb(155, 250, 100)"}
          ],
          
        }
      }
    ];
    
    var layout = {
      font: { family: "Arial" }
    };
    
    Plotly.newPlot('gauge', gaugedata, layout);



  });
}


function buildCharts(sample){


  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
  


// Sort the data array using the sample_values
    result.sample_values.sort(function(a, b) {
      return parseFloat(b) - parseFloat(a);
    });

// Create the bar chart
    var trace1 = {
      x: result.sample_values.slice(0, 10).reverse(),
      y: result.otu_ids.map(id=>`OTU ${id}`).slice(0, 10).reverse(),
      text: result.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      marker:{
      color: result.sample_values.slice(0, 10).reverse()},
      orientation: "h",
      opacity: 0.6
    };


    var bardata = [trace1];


    var layout = {
      xaxis: { title:{text:'Counts'},},

    };

    Plotly.newPlot("bar", bardata, layout);

// Create the bubble chart
    var trace2 = {
      x: result.otu_ids,
      y: result.sample_values,
      
      mode: 'markers',
      marker: {
      color: result.otu_ids,
        opacity: 0.7,
        bordercolor: 'black',
        size: result.sample_values
      }
    };
    
    var bubbledata = [trace2];
    
    var layout = {
      xaxis: { title:{text:'OTU ID'},},
      showlegend: false,
      font: {  family: "Arial" }
    };
    
    Plotly.newPlot('bubble', bubbledata, layout);


  });
};

