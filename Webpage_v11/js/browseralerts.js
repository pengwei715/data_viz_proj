/**
 * Created by mariaschwarz on 5/1/16.
 */

function myFunction() {
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
    {
        alert('Opera');
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 ) {}
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        alert('This page has been developed for Chrome. Some functionality might be missing when using Safari.');
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) {}
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
        alert('This page has been developed for Chrome. Visualizations may not be displayed correctly on Internet Explorer / Edge');
    }
    else
    {
        alert('This page has been developed for Chrome. For optimal functionality, please revert to Chrome or Firefox.');
    }
}

myFunction();