/**
 * Created by mariaschwarz on 5/1/16.
 */



function navbarResize(){
    if ((window.innerWidth < 1300)&(window.innerWidth>=1000)){

        d3.select('#actionMapbuttons2').classed('btn-group', false);
        d3.select('#refugee').classed('am_button', false).classed('am_button_fix', true);
        d3.select('#per_gdppc').classed('am_button', false).classed('am_button_fix', true);
        d3.select('#per_1000pop').classed('am_button', false).classed('am_button_fix', true);

        d3.select("#refugeeStackedbuttions2").classed('btn-group',false);
        d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
        d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
    }

    else if ((window.innerWidth < 1000)&(window.innerWidth>770)){
        $('#navbar').show();
        $('#intro_nav').html("<a href='#intro'>Intro</a>");
        $('#violenceMap_nav').html("<a href='#violenceMapSection'>How?</a>");
        $('#actorChord_nav').html("<a href='#actorChordSection'>Who fights?</a>");
        $('#casualty_nav').html("<a href='#casualtySection'>Who dies?</a>");
        $('#refugeeMap_nav').html("<a href='#refugeeMapSection'>Where to go?</a>");
        $('#actionMap_nav').html("<a href='#actionMapSection'>Who helps?</a>");
        $('#keyTakeaways_nav').html("<a href='#keyTakeawaysSection'>Takeaways</a>");
        $('#aboutUs_nav').html("<a href='#aboutSection'>Us</a>");

        d3.select('#actionMapbuttons2').classed('btn-group', false);
        d3.select('#refugee').classed('am_button', false).classed('am_button_fix', true);
        d3.select('#per_gdppc').classed('am_button', false).classed('am_button_fix', true);
        d3.select('#per_1000pop').classed('am_button', false).classed('am_button_fix', true);

        d3.select("#refugeeStackedbuttions2").classed('btn-group',false);
        d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
        d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
    }

    else if (window.innerWidth<=770){
        $('#navbar').hide();

        d3.select('#actionMapbuttons2').classed('btn-group', false);
        d3.select('#refugee').classed('am_button', false).classed('am_button_fix', true);
        d3.select('#per_gdppc').classed('am_button', false).classed('am_button_fix', true);
        d3.select('#per_1000pop').classed('am_button', false).classed('am_button_fix', true);

        d3.select("#refugeeStackedbuttions2").classed('btn-group',false);
        d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
        d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
    }
    else{
        $('#navbar').show();
        $('#intro_nav').html("<a href='#intro'>Introduction</a>");
        $('#violenceMap_nav').html("<a href='#violenceMapSection'>How is violence spreading?</a>");
        $('#actorChord_nav').html("<a href='#actorChordSection'>Who is fighting?</a>");
        $('#casualty_nav').html("<a href='#casualtySection'>Who are the victims?</a>");
        $('#refugeeMap_nav').html("<a href='#refugeeMapSection'>Where are they going?</a>");
        $('#actionMap_nav').html("<a href='#actionMapSection'>Who is helping?</a>");
        $('#keyTakeaways_nav').html("<a href='#keyTakeawaysSection'>Takeaways</a>");
        $('#aboutUs_nav').html("<a href='#aboutSection'>About Us</a>");

        d3.select('#actionMapbuttons2').classed('btn-group', true);
        d3.select('#refugee').classed('am_button_fix', false).classed('am_button', true);
        d3.select('#per_gdppc').classed('am_button_fix', false).classed('am_button', true);
        d3.select('#per_1000pop').classed('am_button_fix', false).classed('am_button', true);

        d3.select("#refugeeStackedbuttions2").classed('btn-group',true);
        d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
        d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
    }


    $(window).resize(function(){
        if ((window.innerWidth < 1300)&(window.innerWidth>=1000)){

            d3.select('#actionMapbuttons2').classed('btn-group', false);
            d3.select('#refugee').classed('am_button', false).classed('am_button_fix', true);
            d3.select('#per_gdppc').classed('am_button', false).classed('am_button_fix', true);
            d3.select('#per_1000pop').classed('am_button', false).classed('am_button_fix', true);

            d3.select("#refugeeStackedbuttions2").classed('btn-group',false);
            d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
            d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
        }
        else if ((window.innerWidth < 1000)&(window.innerWidth>770)){
            $('#navbar').show();
            $('#intro_nav').html("<a href='#intro'>Intro</a>");
            $('#violenceMap_nav').html("<a href='#violenceMapSection'>How?</a>");
            $('#actorChord_nav').html("<a href='#actorChordSection'>Who fights?</a>");
            $('#casualty_nav').html("<a href='#casualtySection'>Who dies?</a>");
            $('#refugeeMap_nav').html("<a href='#refugeeMapSection'>Where to go?</a>");
            $('#actionMap_nav').html("<a href='#actionMapSection'>Who helps?</a>");
            $('#keyTakeaways_nav').html("<a href='#keyTakeawaysSection'>Takeaways</a>");
            $('#aboutUs_nav').html("<a href='#aboutSection'>Us</a>");

            d3.select('#actionMapbuttons2').classed('btn-group', false);
            d3.select('#refugee').classed('am_button', false).classed('am_button_fix', true);
            d3.select('#per_gdppc').classed('am_button', false).classed('am_button_fix', true);
            d3.select('#per_1000pop').classed('am_button', false).classed('am_button_fix', true);

            d3.select("#refugeeStackedbuttions2").classed('btn-group',false);
            d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
            d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
        }

        else if (window.innerWidth<=770){
            $('#navbar').hide();

            d3.select('#actionMapbuttons2').classed('btn-group', false);
            d3.select('#refugee').classed('am_button', false).classed('am_button_fix', true);
            d3.select('#per_gdppc').classed('am_button', false).classed('am_button_fix', true);
            d3.select('#per_1000pop').classed('am_button', false).classed('am_button_fix', true);

            d3.select("#refugeeStackedbuttions2").classed('btn-group',false);
            d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
            d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
        }
        else{
            $('#navbar').show();
            $('#intro_nav').html("<a href='#intro'>Introduction</a>");
            $('#violenceMap_nav').html("<a href='#violenceMapSection'>How is violence spreading?</a>");
            $('#actorChord_nav').html("<a href='#actorChordSection'>Who is fighting?</a>");
            $('#casualty_nav').html("<a href='#casualtySection'>Who are the victims?</a>");
            $('#refugeeMap_nav').html("<a href='#refugeeMapSection'>Where are they going?</a>");
            $('#actionMap_nav').html("<a href='#actionMapSection'>Who is helping?</a>");
            $('#keyTakeaways_nav').html("<a href='#keyTakeawaysSection'>Takeaways</a>");
            $('#aboutUs_nav').html("<a href='#aboutSection'>About Us</a>");

            d3.select('#actionMapbuttons2').classed('btn-group', true);
            d3.select('#refugee').classed('am_button_fix', false).classed('am_button', true);
            d3.select('#per_gdppc').classed('am_button_fix', false).classed('am_button', true);
            d3.select('#per_1000pop').classed('am_button_fix', false).classed('am_button', true);

            d3.select("#refugeeStackedbuttions2").classed('btn-group',true);
            d3.select('#level_1').classed('cp_button',false).classed('cp_button_fix',true);
            d3.select('#level_3').classed('cp_button',false).classed('cp_button_fix',true);
        }


    });

}