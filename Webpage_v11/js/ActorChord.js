/* Data-Viz for Actor Chord Diagram*/

/******** Designer Mar Carpanelli ********/

/* Builds on https://github.com/nbremer/Chord-Diagram-Storytelling */

//Short dataset

var NameSource = ["Government/ Military","Civilians/ Protesters","Foreign","Rebels/ Extremists","ISIS","Al Qaeda/ Jabhat al-Nusra","Kurds","Unknown/ Other"];
var NameSource_Short = ["Government/Military","Civilians/Protesters","Foreign","Rebels/Extremists","ISIS","A/J","Kurds","Other"];

var matrix = [
    [0.20,16.2953109,0.6027602,14.3789491,0.2452611,0.5487197,0.0207848,12.1632857], /*Government/Military 44.45*/
    [0.72,0.2327902,0.3325574,1.1847356,0.1330229,0.0290988,0.0498836,1.1431659], /*Civilians/Protesters 3.83%*/
    [0.83,1.0683405,0.511307,1.0683405,0.0914533,0.0914533,0.0665115,8.8460259], /*Foreign 12.57%*/
    [11.34,6.950449,1.1015963,3.2258065,0.4738942,0.1995344,0.3034586,6.3809445], /*Rebels/Extremists 21.97%*/
    [0.32,0.5154639,0.0789824,0.631859,0.0374127,0.1080811,0.120552,0.8646492], /*ISIS 2.68%*/
    [0.37,0.4697373,0.1496508,0.3076156,0.0831393,0.0789824,0.0498836,0.50715], /*Al Qaeda / Jabhat al-Nusra 2.02%%*/
    [0.01,0.0748254,0.0457266,0.2909877,0.1080811,0.0290988,0.0249418,0.120552], /*Kurds 0.7%*/
    [0.37,1.7001995,0.5404057,0.5819754,0.1538078,0.0290988,0.0249418,0.374127] /*Unknown/Other 3.77%*/
];

/*Sums up to exactly 100*/

//var colors = ["#1f78b4","#b2df8a","#e31a1c","#33a02c","#a6cee3","#fdbf6f","#ff7f00","#fb9a99"];
var colors = ['#377eb8', '#a65628', '#ffff33', '#4daf4a', '#e41a1c', '#ff7f00', '#ff08e8', '#666666'];

/*Initiate the color scale*/
var fill = d3.scale.ordinal()
    .domain(d3.range(NameSource.length))
    .range(colors);

/*//////////////////////////////////////////////////////////
 /////////////// Initiate Chord Diagram /////////////////////
 //////////////////////////////////////////////////////////*/

var margin = {top: 20, right: 25, bottom: 20, left: 25},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    innerRadius = Math.min(width, height) * .39,
    outerRadius = innerRadius * 1.1;

/*Initiate the SVG*/
var svg = d3.select("#chordchart").append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");


var chord = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending) /*sort the chords inside an arc from high to low*/
    .sortChords(d3.descending) /*which chord should be shown on top when chords cross. Now the biggest chord is at the bottom*/
    .matrix(matrix);


/*//////////////////////////////////////////////////////////
 ////////////////// Draw outer Arcs /////////////////////////
 //////////////////////////////////////////////////////////*/

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var g = svg.selectAll("g.group")
    .data(chord.groups)
    .enter().append("svg:g")
    .attr("class", function(d) {return "group " + NameSource[d.index];});

g.append("svg:path")
    .attr("class", "arc")
    .style("stroke", function(d) { return fill(d.index); })
    .style("fill", function(d) { return fill(d.index); })
    .attr("d", arc)
    .style("opacity", 0)
    .transition().duration(1000)
    .style("opacity", 0.4);

/*//////////////////////////////////////////////////////////
 ////////////////// Initiate Ticks //////////////////////////
 //////////////////////////////////////////////////////////*/

var ticks = svg.selectAll("g.group").append("svg:g")
    .attr("class", function(d) {return "ticks " + NameSource[d.index];})
    .selectAll("g.ticks")
    .attr("class", "ticks")
    .data(groupTicks)
    .enter().append("svg:g")
    .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90 ) +  ")"
            + "translate(" + outerRadius+40 + ",0)";
    });

/*Append the tick around the arcs*/
ticks.append("svg:line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .attr("class", "ticks")
    .style("stroke", "#404040");

/*Add the labels for the %'s*/
ticks.append("svg:text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("class", "tickLabels")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return d.label; })
    .attr('opacity', 0)
    .attr('fill', "#fff");




/*//////////////////////////////////////////////////////////
 ////////////////// Initiate Names //////////////////////////
 //////////////////////////////////////////////////////////*/

g.append("svg:text")
    .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("class", "titles")
    //.attr("text-anchor", function(d) { return d.angle > Math.PI ? "middle" : null; })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 55) + ")"
            + (d.angle != Math.PI ? "rotate(90)" : "");
    })
    .attr('opacity', 0)
    .text(function(d,i) { return NameSource_Short[i]; })
    .attr('fill', "#fff");




/*//////////////////////////////////////////////////////////
 //////////////// Initiate inner chords /////////////////////
 //////////////////////////////////////////////////////////*/

var chords = svg.selectAll("path.chord")
    .data(chord.chords)
    .enter().append("svg:path")
    .attr("class", "chord")
    .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
    .style("fill", function(d) { return fill(d.source.index); })
    .attr("d", d3.svg.chord().radius(innerRadius))
    .attr('opacity', 0);

/*//////////////////////////////////////////////////////////
 ///////////// Initiate Progress Bar ////////////////////////
 //////////////////////////////////////////////////////////*/
/*Initiate variables for bar*/
var progressColor = ["#D1D1D1","#949494"],
    progressClass = ["prgsBehind","prgsFront"],
    prgsWidth = 0.2*650,
    prgsHeight = 3;
/*Create SVG to visualize bar in*/
var progressBar = d3.select("#progress").append("svg")
    .attr("width", prgsWidth)
    .attr("height", 3*prgsHeight);
/*Create two bars of which one has a width of zero*/
progressBar.selectAll("rect")
    .data([prgsWidth, 0])
    .enter()
    .append("rect")
    .attr("class", function(d,i) {return progressClass[i];})
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", function (d) {return d;})
    .attr("height", prgsHeight)
    .attr("fill", function(d,i) {return progressColor[i];});

/*//////////////////////////////////////////////////////////
 /////////// Initiate the Center Texts //////////////////////
 //////////////////////////////////////////////////////////*/
/*Create wrapper for center text*/
var textCenter = svg.append("g")
    .attr("class", "explanationWrapper")
    .attr('fill', "#fff");

/*Starting text middle top*/
var middleTextTop = textCenter.append("text")
    .attr("class", "explanation")
    .attr("text-anchor", "middle")
    .attr("x", 0 + "px")
    .attr("y", -150/2 + "px")
    .attr("dy", "1em")
    .attr("opacity", 1)
    .text("Over time, as the Syrian conflict grew in scale and complexity, there was a shift in the main actors involved in reported violence.")
    .call(wrap, 230);

/*Starting text middle bottom*/
var middleTextBottom = textCenter.append("text")
    .attr("class", "explanation")
    .attr("text-anchor", "middle")
    .attr("x", 0 + "px")
    .attr("y", 60/2 + "px")
    .attr("dy", "1em")
    .attr('opacity', 1)
    .text("We use media data to connect violence events among different actors, and to explore how they shifted over time.")
    .call(wrap, 260);


/*//////////////////////////////////////////////////////////
 //////////////// Storyboarding Steps ///////////////////////
 //////////////////////////////////////////////////////////*/

var counter = 1,
    buttonTexts = ["Ok","Go on","Continue","Got it","Go on","Continue","Got it","Continue",
        "Continue","Continue","Continue","Continue","Continue","Finish"],
    opacityValueBase = 0.8,
    opacityValue = 0.4;

/*Reload page*/
d3.select("#reset")
    .on("click", function(e) {location.reload();});

/*Skip to final visual right away*/
d3.select("#skip")
    .on("click", finalChord);

/*Order of steps when clicking button*/
d3.select("#clicker")
    .on("click", function(e){

        //Introduction
        if(counter == 1) Draw1();
        //Show Arc of Government / Military
        else if(counter == 2) Draw2();
        //Draw the other arcs as well
        else if(counter == 3) Draw3();
        //Chord between Government/Military and Civilians / Protestors
        else if(counter == 4) Draw4();
        //Civilians / Protestors side of Civilians / Protestors-Government/Military chord
        else if(counter == 5) Draw5();
        //Government/Military to Civilians/Protestors
        else if(counter == 6) Draw6();
        //Government/Military side of Civilians / Protestors-Government/Military chord
        else if(counter == 7) Draw7();
        // Government net source
        else if(counter == 8) Draw8();
        //Show Self-inflicted violence hills
        else if(counter == 9) Draw9();
        //Show hills - explain Rebels/Extremists
        else if(counter == 10) Draw10();
        //Show all chords that are connected to Government
        else if(counter == 11) Draw11();
        //Government / Military are blue
        else if(counter == 12) Draw12();
        //Government / Military was a relatively small target of violence
        else if(counter == 13) Draw13();
        //Final wrap up
        else if(counter == 14) Draw14();
        //Draw the original Chord diagram
        else if(counter == 15) finalChord();

        counter = counter + 1;
    });


/*//////////////////////////////////////////////////////////
 //Introduction
 ///////////////////////////////////////////////////////////*/
function Draw1(){

    /*First disable click event on clicker button*/
    stopClicker();

    /*Show and run the progressBar*/
    runProgressBar(time=700*11);

    changeTopText(newText = "Who are the main souces of violence? " +
            "",
        loc = 4/2, delayDisappear = 0, delayAppear = 1);

    changeTopText(newText = "The next steps show the spread of violence, using data on 24,056 events reported in the media in 2011-2015.",
        loc = 6/2, delayDisappear = 5, delayAppear = 6, finalText = true);

    changeBottomText(newText = "Let's start by drawing out the share of violent events initiated by the Government / Military...",
        loc = 1/2, delayDisappear = 0, delayAppear = 10);

    //Remove arcs again
    d3.selectAll(".arc")
        .transition().delay(9*700).duration(2100)
        .style("opacity", 0)
        .each("end", function() {d3.selectAll(".arc").remove();});

};/*Draw1*/

/*//////////////////////////////////////////////////////////
 //Begin Explanation
 //////////////////////////////////////////////////////////*/
function Draw2(){

    /*First disable click event on clicker button*/
    stopClicker();

    /*Show and run the progressBar*/
    runProgressBar(time=700*2);

    /*Initiate all arcs but only show the Government/Military arc (d.index = 0)*/
    g.append("svg:path")
        .style("stroke", function(d) { return fill(d.index); })
        .style("fill", function(d) { return fill(d.index); })
        .transition().duration(700)
        .attr("d", arc)
        .attrTween("d", function(d) {
            if(d.index == 0) {
                var i = d3.interpolate(d.startAngle, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                    return arc(d);
                }
            }
        });

    /*Show the tick around the Government/Military arc*/
    d3.selectAll("g.group").selectAll("line")
        .transition().delay(700).duration(1000)
        .style("stroke", function(d, i, j) {return j ? 0 : "#fff"; });

    /*Add the labels for the %'s at Government/Military*/
    d3.selectAll("g.group").selectAll(".tickLabels")
        .transition().delay(700).duration(2000)
        .attr("opacity", function(d, i, j) {return j ? 0 : 1; });

    /*Show the Government/Military name*/
    d3.selectAll(".titles")
        .transition().duration(2000)
        .attr("opacity", function(d, i) {return d.index ? 0 : 1; });

    /*Switch  text*/
    changeTopText(newText = "44% of reported violent events include the Government / Military as a source.",
        loc = 4/2, delayDisappear = 0, delayAppear = 1, finalText = true);

    changeBottomText(newText = "",
        loc = 0/2, delayDisappear = 0, delayAppear = 1)	;

};/*Draw2*/

/*///////////////////////////////////////////////////////////
 //Draw the other arcs
 //////////////////////////////////////////////////////////*/
function Draw3(){

    /*First disable click event on clicker button*/
    stopClicker();

    var arcDelay = [0,1,2,8,13,14,15,18,20,23,27];
    /*Show and run the progressBar*/
    runProgressBar(time=700*(arcDelay[(arcDelay.length-1)]+1));

    /*Fill in the other arcs*/
    svg.selectAll("g.group").select("path")
        .transition().delay(function(d, i) { return 700*arcDelay[i];}).duration(1000)
        .attrTween("d", function(d) {
            if(d.index != 0) {
                var i = d3.interpolate(d.startAngle, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                    return arc(d);
                }
            }
        });

    /*Make the other strokes black as well*/
    svg.selectAll("g.group")
        .transition().delay(function(d,i) { return 700*arcDelay[i]; }).duration(700)
        .selectAll("g").selectAll("line").style("stroke", "#fff");
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().delay(function(d,i) { return 700*arcDelay[i]; }).duration(700)
        .selectAll("g").selectAll("text").style("opacity", 1);
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().delay(function(d,i) { return 700*arcDelay[i]; }).duration(700)
        .selectAll("text").style("opacity", 1);

    /*Change the text of the top section inside the circle accordingly*/
    /*Civilians/Protesters*/
    changeTopText(newText = "Civilians/Protesters issue ~4% of violence.",
        loc = 2/2, delayDisappear = 0, delayAppear = arcDelay[2]-1);
    /*Rebels/Extremists*/
    changeTopText(newText = "Rebels/Extremists are the second largest source, with ~30%.",
        loc = 2/2, delayDisappear = arcDelay[3]-1, delayAppear = arcDelay[3]);
    /*ISIS, Al Qaeda / Jabhat al-Nusra, and Kurds*/
    changeTopText(newText = "5.4% comes from ISIS, Al Qaeda / Jabhat al-Nusra, and Kurds. Another 4% comes from Others, which includes the private sector and the Media.",
        loc = 4/2, delayDisappear = (arcDelay[4]-1), delayAppear = arcDelay[4]);
    /*Unknown/Others*/
    changeTopText(newText = "\"Others\" include businesses and the Media, accounting for ~4%.",
        loc = 2/2, delayDisappear = arcDelay[9]-1, delayAppear = (arcDelay[8]-1));
    /*100%*/
    changeTopText(newText = "",
        loc = 4/2, delayDisappear = (arcDelay[9]-1), delayAppear = arcDelay[9]);
    /*Chord intro*/
    changeTopText(newText = "This circle shows what share of reported violence was produced by each source or actor.",
        loc = 4/2, delayDisappear = (arcDelay[9]), delayAppear = arcDelay[10]-1, finalText = true);

    /*Change the text of the bottom section inside the circle accordingly*/
    /*Foreign*/
    changeBottomText(newText = "Foreign actors account for ~13%.",
        loc = 2/2, delayDisappear = 0, delayAppear = arcDelay[2]);
    /*Rebels/Extremists*/
    changeBottomText(newText = "",
        loc = 1/2, delayDisappear = arcDelay[3]-1, delayAppear = arcDelay[4]);
    /*Unknown/Others*/
    changeBottomText(newText = "",
        loc = 2/2, delayDisappear = (arcDelay[7]), delayAppear = (arcDelay[8]-1));
    /*Unknown/Others*/
    changeBottomText(newText = "Now... Who are the targets of these actors?",
        loc = 2/2, delayDisappear = (arcDelay[9]), delayAppear = (arcDelay[10]));
};/*Draw3*/

/*///////////////////////////////////////////////////////////
 //Chord between Government/Military and Civilians / Protestors
 //////////////////////////////////////////////////////////*/
function Draw4(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*2);

    /*AJ and ISIS intro text*/
    changeTopText(newText = "First, let's only look at the Civilians / Protestors that were targeted by the Government.",
        loc = 2, delayDisappear = 0, delayAppear = 1, finalText = true);

    /*Bottom text disappear*/
    changeBottomText(newText = "",
        loc = 0, delayDisappear = 0, delayAppear = 1);

    /*Make all other arcs less visible*/
    svg.selectAll("g.group").select("path")
        .transition().duration(1000)
        .style("opacity", function(d) {
            if(d.index != 0 && d.index != 1) {return opacityValue;}
        });

    /*Make the other strokes less visible*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(700)
        .style("stroke",function(d,i,j) {if (j == 1 || j == 0) {return "#fff";} else {return "#DBDBDB";}});
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".tickLabels").style("opacity",function(d,i,j) {if (j == 1 || j == 0) {return 1;} else {return opacityValue;}});
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".titles").style("opacity", function(d) { if(d.index == 0 || d.index == 1) {return 1;} else {return opacityValue;}});

    /*Show only the Government/Military - Civilians / Protestors chord*/
    chords.transition().duration(2000)
        .attr("opacity", function(d, i) {
            if(d.source.index == 0 && d.target.index == 1)
            {return opacityValueBase;}
            else {return 0;}
        });

};/*Draw4*/


/*//////////////////////////////////////////////////////////////////////////*/
//Civilians / Protestors side of Civilians / Protestors-Government/Military chord
/*//////////////////////////////////////////////////////////////////////////*/
function Draw5(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*2);

    /*Text*/
    changeTopText(newText = "On the bottom, touching the arc of Civilians / Protestors, the thickness of the cord spans less than 1%.",
        loc = 2, delayDisappear = 0, delayAppear = 1, finalText = true);

    /*Make the non Civilians / Protestors & Government/Military arcs less visible*/
    svg.selectAll("g.group").select("path")
        .transition().duration(1000)
        .style("opacity", opacityValue);

    /*Show only the relationship part at Civilians / Protestors*/
    var arcAJ = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(2.83)
        .endAngle(2.872);

    svg.append("path")
        .attr("class","govToCivArc")
        .attr("d", arcAJ)
        .attr("fill", colors[1])
        .style('stroke', colors[1]);

    repeat();

    /*Repeatedly let an arc change colour*/
    function repeat() {
        d3.selectAll(".govToCivArc")
            .transition().duration(700)
            .attr("fill", "#9FA6D0")
            .style('stroke', "#9FA6D0")
            .transition().duration(700)
            .attr("fill", colors[1])
            .style('stroke', colors[1])
            .each("end", repeat)
        ;
    };

};/*Draw5*/


/*//////////////////////////////////////////////////////////////////////////*/
// Government/Military to Civilians/Protestors
/*//////////////////////////////////////////////////////////////////////////*/
function Draw6(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*2);

    /*Text*/
    changeTopText(newText = "Follow the chord of the events targeted towards Civilians / Protesters to see who targeted them. Here, it is the Government / Military.",
        loc = 2, delayDisappear = 0, delayAppear = 1, finalText = true);

    /*Show only the part at Civilians/Protestors*/
    var arcISIS = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(0.97);

    svg.append("path")
        .attr("class","civToGovArc")
        .attr("d", arcISIS)
        .attr("opacity", 0)
        .attr("fill", colors[0])
        .transition().duration(700)
        .attr("opacity", 1)
        .attr("stroke", colors[0]);

};/*Draw6*/


/*//////////////////////////////////////////////////////////////////////////*/
//Government/Military side of Civilians / Protestors-Government/Military chord
/*//////////////////////////////////////////////////////////////////////////*/
function Draw7(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*11);

    /*Text*/
    changeTopText(newText = "At the Government / Military side, the arc is much thicker, spanning 16% of total events.",
        loc = 2, delayDisappear = 0, delayAppear = 1);
    changeTopText(newText = "These 16% of events have the Government / Military as a source of violence. By following the chord we can see that they were targeted at Civilians / Protesters.",
        loc = 2, delayDisappear = 9, delayAppear = 10, finalText = true);

    /*Stop the color changing*/
    d3.selectAll(".govToCivArc")
        .transition().duration(700)
        .attr("fill", colors[1])
        .style("stroke", colors[1]);

    /*Repeatedly let an arc change colour*/
    repeat();
    function repeat() {
        d3.selectAll(".civToGovArc")
            .transition().duration(700)
            .attr("fill", "#99D2E9")
            .style('stroke', "#99D2E9")
            .transition().duration(700)
            .attr("fill", colors[1])
            .style("stroke", colors[1])
            .each("end", repeat)
        ;
    };

};/*Draw7*/


/*//////////////////////////////////////////////////////////////////////////*/
// Government/Military as net source of violence
/*//////////////////////////////////////////////////////////////////////////*/
function Draw8(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*11);

    /*Text*/
    changeTopText(newText = "The chord is wider at the Government / Military side, since they are a net issuer of violence to Civilians / Protesters.",
        loc = 2, delayDisappear = 0, delayAppear = 1);
    changeTopText(newText = "Therefore, the chord is the color of Government / Military, i.e. blue.",
        loc = 3/2, delayDisappear = 9, delayAppear = 10, finalText = true);

    /*Stop the color changing*/
    d3.selectAll(".civToGovArc")
        .transition().duration(700)
        .attr("fill", colors[0])
        .style("stroke", colors[0]);

};/*Draw8*/


/*///////////////////////////////////////////////////////////
 //Show Self-inflicted violence hills
 //////////////////////////////////////////////////////////*/
function Draw9(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*20);

    /*Text*/
    changeTopText(newText = "There are also reported events that occurred within the same group of actors.",
        loc = 3/2, delayDisappear = 0, delayAppear = 1, finalText = false, xloc=0, w=240);
    changeTopText(newText = "These events are represented by the hills at each group of actors.",
        loc = 3/2, delayDisappear = 9, delayAppear = 10, finalText = false, xloc=0, w=240);
    changeTopText(newText = "You can also envision this as a chord beginning and ending on itself.",
        loc = 2/2, delayDisappear = 18, delayAppear = 19, finalText = true, xloc=0, w=240);

    /*Remove the arcs*/
    d3.selectAll(".civToGovArc")
        .transition().duration(2000)
        .attr("opacity", 0)
        .each("end", function() {d3.selectAll(".civToGovArc").remove();});

    d3.selectAll(".govToCivArc")
        .transition().duration(2000)
        .attr("opacity", 0)
        .each("end", function() {d3.selectAll(".govToCivArc").remove();});

    /*Show only the self-inflicted chords*/
    chords.transition().duration(2000)
        .attr("opacity", function(d, i) {
            if(d.source.index == 0 && d.target.index == 0) {return opacityValueBase;} // Gvt / Rebels
            else if(d.source.index == 1 && d.target.index == 1) {return opacityValueBase;} // Civilians / Protestors
            else if(d.source.index == 2 && d.target.index == 2) {return opacityValueBase;} // Foreign
            else if(d.source.index == 3 && d.target.index == 3) {return opacityValueBase;} // Rebels / Extremists
            else if(d.source.index == 4 && d.target.index == 4) {return opacityValueBase;} // ISIS
            else if(d.source.index == 5 && d.target.index == 5) {return opacityValueBase;} // Al-Qaeda
            else if(d.source.index == 6 && d.target.index == 6) {return opacityValueBase;} // Kurds
            else if(d.source.index == 7 && d.target.index == 7) {return opacityValueBase;} // Unknown/ Others
            else {return 0;}
        });


    /*Show all ticks and texts again*/
    /*Ticks*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(700)
        .style("stroke", "#fff");
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".tickLabels").style("opacity", 1);
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".titles").style("opacity", 1);

};/*Draw9*/


/*//////////////////////////////////////////////////////////////////////////*/
//Show hills - explain Rebels/Extremists
/*//////////////////////////////////////////////////////////////////////////*/
function Draw10(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*11);

    changeTopText(newText = "For example, 3% of events that have Rebels / Extremists as both a source and a target of violence.",
        loc = 2/2, delayDisappear = 0, delayAppear = 1);
    changeTopText(newText = "This means that about 15% of Rebels / Extremists"+
            " violence events remained within that group.",
        loc = 2/2, delayDisappear = 9, delayAppear = 10, finalText = true);

    /*Show only the Rebels/Extremists arc*/
    var arcRebels = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(0);

    svg.append("path")
        .attr("class","RebelsSelfArc")
        .attr("d", arcRebels)
        .attr("opacity", 1)
        .attr("stroke", colors[4])
        .attr("fill", colors[4]);

    /*Repeatedly let an arc change colour*/
    //repeat();

    function repeat() {
        d3.selectAll(".RebelsSelfArc")
            .transition().duration(700)
            .attr("fill", "#99D2E9")
            .style('stroke', "#99D2E9")
            .transition().duration(700)
            .attr("fill", colors[3])
            .style("stroke", colors[3])
            .each("end", repeat);
    };

    /*Show only the Rebels/Extremists chord*/
    chords.transition().duration(2000)
        .attr("opacity", function(d, i) {
            if(d.source.index == 3 && d.target.index == 3) {return opacityValueBase;}
            else {return 0;}
        });

    /*Make the other strokes less visible*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(700)
        .style("stroke",function(d,i,j) {if (j == 4) {return "#fff";} else {return "#DBDBDB";}});
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".tickLabels").style("opacity",function(d,i,j) {if (j == 3) {return 1;} else {return opacityValue;}});
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".titles").style("opacity", function(d) { if(d.index == 3) {return 1;} else {return opacityValue;}});

};/*Draw10*/


/*//////////////////////////////////////////////////////////
 //Show all chords that are connected to the Government / Military
 //////////////////////////////////////////////////////////*/
function Draw11(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*2);

    changeTopText(newText = "Here are all the chords for events that involve "+
            "the Government / Military as a source or as a target.",
        loc = 4/2, delayDisappear = 0, delayAppear = 1, finalText = true, xloc=0, w=200);

    /*Remove the Rebels/Extremists arc*/
    d3.selectAll(".ISISSelfArc")
        .transition().duration(1000)
        .attr("opacity", 0)
        .each("end", function() {d3.selectAll(".ISISSelfArc").remove();});

    /*Only show the chords of Government / Military */
    chords.transition().duration(2000)
        .attr("opacity", function(d, i) {
            if(d.source.index == 0 || d.target.index == 0) {return opacityValueBase;}
            else {return 0;}
        });

    /*Highlight arc of Government / Military */
    svg.selectAll("g.group").select("path")
        .transition().duration(2000)
        .style("opacity", function(d) {
            if(d.index != 0) {return opacityValue;}
        });

    /*Show only the ticks and text at Government / Military */
    /*Make the other strokes less visible*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(700)
        .style("stroke",function(d,i,j) {if (j == 0) {return "#fff";} else {return "#DBDBDB";}});
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".tickLabels").style("opacity",function(d,i,j) {if (j == 0) {return 1;} else {return opacityValue;}});
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".titles").style("opacity", function(d) { if(d.index == 0) {return 1;} else {return opacityValue;}});

};/*Draw11*/


/*//////////////////////////////////////////////////////////
 // Government / Military are blue
 //////////////////////////////////////////////////////////*/
function Draw12(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*11);

    changeTopText(newText = "Most chords connected to the Government/ Military" +
            " are the color of the Government/ Military arc, i.e. blue.",
        loc = 4/2, delayDisappear = 0, delayAppear = 1, finalText = false, xloc=0, w=210);
    changeTopText(newText = "This means that, except for Foreign actors and ISIS, the Government / Military has been a net source of violence.",
        loc = 4/2, delayDisappear = 9, delayAppear = 10, finalText = true, xloc=0, w=210);

};/*Draw12*/


/*//////////////////////////////////////////////////////////
 //Government / Military was a relatively small target of violence
 //////////////////////////////////////////////////////////*/
function Draw13(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    runProgressBar(time=700*11);

    changeTopText(newText = "Apart from the chord to Rebels / Extremists, all other blue chords are narrow.",
        loc = 4/2, delayDisappear = 0, delayAppear = 1, finalText = false, xloc=0, w=200);
    changeTopText(newText = "This means that the main aggressor of the government are Rebels / Extremists.",
        loc = 4/2, delayDisappear = 9, delayAppear = 10, finalText = true, xloc=0, w=200);

    /*Repeatedly let specific chords change colour*/
    repeat();

    function repeat() {
        chords
            .transition().duration(1000)
            .style("opacity",function (d){
                if(d.source.index == 0) {
                    if(d.source.index == 0 || d.target.index == 3) {return opacityValueBase;}
                    else {return 0.2;}
                } else {return 0;}
            })
            .transition().duration(1000)
            .style("opacity",function (d){
                if(d.source.index == 0) {return opacityValueBase;}
                else {return 0;}
            })
            .each("end", repeat);
    };
};/*Draw13*/


/*//////////////////////////////////////////////////////////
 //Final wrap up
 //////////////////////////////////////////////////////////*/
function Draw14(){

    /*First disable click event on clicker button*/
    stopClicker();
    /*Show and run the progressBar*/
    /*runProgressBar(time=700*2);*/

    changeTopText(newText = "After these examples you can see all the chords simultaneously.",
        loc = 4/2, delayDisappear = 0, delayAppear = 1, finalText = true);

    changeBottomText(newText = "Now, you are ready to explore the data on your own!",
        loc = 1/2, delayDisappear = 0, delayAppear = 1);

    /*Only show the chords of Government/Military*/
    chords.transition().duration(1000)
        .style("opacity", 0.1);

    /*Hide all the text*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(700)
        .style("stroke","#DBDBDB");
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".tickLabels").style("opacity",0.4);
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(700)
        .selectAll(".titles").style("opacity",0.4);

};/*Draw14*/

/*///////////////////////////////////////////////////////////
 //Draw the original Chord diagram
 ///////////////////////////////////////////////////////////*/
/*Go to the final bit*/
function finalChord() {

    /*Remove button*/
    d3.select("#clicker")
        .style("visibility", "hidden");
    d3.select("#skip")
        .style("visibility", "hidden");
    d3.select("#progress")
        .style("visibility", "hidden");

    /*Remove texts*/
    changeTopText(newText = "",
        loc = 0, delayDisappear = 0, delayAppear = 1);
    changeBottomText(newText = "",
        loc = 0, delayDisappear = 0, delayAppear = 1);

    /*Create arcs or show them, depending on the point in the visual*/
    if (counter <= 4 ) {
        g.append("svg:path")
            .style("stroke", function(d) { return fill(d.index); })
            .style("fill", function(d) { return fill(d.index); })
            .attr("d", arc)
            .style("opacity", 0)
            .transition().duration(1000)
            .style("opacity", 1);

    } else {
        /*Make all arcs visible*/
        svg.selectAll("g.group").select("path")
            .transition().duration(1000)
            .style("opacity", 1);
    };

    /*Make mouse over and out possible*/
    d3.selectAll(".group")
        .on("mouseover", fade(.02))
        .on("mouseout", fade(.80));

    d3.selectAll(".group")
        .on("click", function(d) {
            stackedArea.series.attr("opacity", 0.2);
        });

    /*Show all chords*/
    chords.transition().duration(1000)
        .style("opacity", opacityValueBase);

    /*Show all the text*/
    d3.selectAll("g.group").selectAll("line")
        .transition().duration(100)
        .style("stroke","#fff");
    /*Same for the %'s*/
    svg.selectAll("g.group")
        .transition().duration(100)
        .selectAll(".tickLabels").style("opacity",1);
    /*And the Names of each Arc*/
    svg.selectAll("g.group")
        .transition().duration(100)
        .selectAll(".titles").style("opacity",1);

};/*finalChord*/

/*//////////////////////////////////////////////////////////
 ////////////////// Extra Functions /////////////////////////
 //////////////////////////////////////////////////////////*/

/*Returns an event handler for fading a given chord group*/
function fade(opacity) {
    return function(d, i) {
        svg.selectAll("path.chord")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
            .transition()
            .style("stroke-opacity", opacity)
            .style("fill-opacity", opacity);
    };
};/*fade*/

/*Returns an array of tick angles and labels, given a group*/
function groupTicks(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1).map(function(v, i) {
        return {
            angle: v * k + d.startAngle,
            label: i % 5 ? null : v + "%"
        };
    });
};/*groupTicks*/

/*From https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
 //Calls a function only after the total transition ends*/
function endall(transition, callback) {
    var n = 0;
    transition
        .each(function() { ++n; })
        .each("end", function() { if (!--n) callback.apply(this, arguments); });
};/*endall*/

//Builds heavily on http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
    var text = d3.select(this[0][0]),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4,
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        };
    };
};

/*Transition the top circle text*/
function changeTopText (newText, loc, delayDisappear, delayAppear, finalText, xloc, w) {

    /*If finalText is not provided, it is not the last text of the Draw step*/
    if(typeof(finalText)==='undefined') finalText = false;

    if(typeof(xloc)==='undefined') xloc = 0;
    if(typeof(w)==='undefined') w = 260;

    middleTextTop
    /*Current text disappear*/
        .transition().delay(700 * delayDisappear).duration(700)
        .attr('opacity', 0)
        /*New text appear*/
        .call(endall,  function() {
            middleTextTop.text(newText)
                .attr("y", -24*loc + "px")
                .attr("x", xloc + "px")
                .call(wrap, w);
        })
        .transition().delay(700 * delayAppear).duration(700)
        .attr('opacity', 1)
        .call(endall,  function() {
            if (finalText == true) {
                d3.select("#clicker")
                    .text(buttonTexts[counter-2])
                    .style("pointer-events", "auto")
                    .transition().duration(400)
                    .style("border-color", "#fff")
                    .style("color", "#fff");
            };
        });
};/*changeTopText */

/*Transition the bottom circle text*/
function changeBottomText (newText, loc, delayDisappear, delayAppear) {
    middleTextBottom
    /*Current text disappear*/
        .transition().delay(700 * delayDisappear).duration(700)
        .attr('opacity', 0)
        /*New text appear*/
        .call(endall,  function() {
            middleTextBottom.text(newText)
                .attr("y", 24*loc + "px")
                .call(wrap, 250);
        })
        .transition().delay(700 * delayAppear).duration(700)
        .attr('opacity', 1);
    ;}/*changeTopText*/

/*Stop clicker from working*/
function stopClicker() {
    d3.select("#clicker")
        .style("pointer-events", "none")
        .transition().duration(400)
        .style("border-color", "#908989")
        .style("color", "#908989");
};/*stopClicker*/

/*Run the progress bar during an animation*/
function runProgressBar(time) {

    /*Make the progress div visible*/
    d3.selectAll("#progress")
        .style("visibility", "visible");

    /*Linearly increase the width of the bar
     //After it is done, hide div again*/
    d3.selectAll(".prgsFront")
        .transition().duration(time).ease("linear")
        .attr("width", prgsWidth)
        .call(endall,  function() {
            d3.selectAll("#progress")
                .style("visibility", "hidden");
        });

    /*Reset to zero width*/
    d3.selectAll(".prgsFront")
        .attr("width", 0);

};/*runProgressBar*/