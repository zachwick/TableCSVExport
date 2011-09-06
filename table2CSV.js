/*
   Based on the jQuery plugin found at http://www.kunalbabre.com/projects/table2CSV.php
   Re-worked by ZachWick for LectureTools Inc. Sept. 2011
   Released under the MIT License (http://www.opensource.org/licenses/mit-license.php)
   Copyright retained by LectureTools Inc. (http://www.lecturetools.com)
*/
jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value, download
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        jQuery(el).filter(':visible').find('th').each(function() {
            if (jQuery(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData(jQuery(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    jQuery(el).find('tr').each(function() {
        var tmpRow = [];
        jQuery(this).filter(':visible').find('td').each(function() {
            if (jQuery(this).css('display') != 'none') tmpRow[tmpRow.length] = jQuery.trim(formatData(jQuery(this).html()));
        });
        row2CSV(tmpRow);
    });
    if ((options.delivery == 'popup')||(options.delivery == 'download')) {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = jQuery.trim(mystr);
        }
    }
    function formatData(input) {
        // replace " with “
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "“");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';
        return '' + output + '';
    }
    function popup(data) {
	if (options.delivery == 'download') {
           window.location='data:text/csv;charset=utf8,' + encodeURIComponent(data);
           return true;
	} else {
           var generator = window.open('', 'csv', 'height=400,width=600');
           generator.document.write('<html><head><title>CSV</title>');
           generator.document.write('</head><body >');
           generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
           generator.document.write(data);
           generator.document.write('</textArea>');
           generator.document.write('</body></html>');
           generator.document.close();
           return true;
	}
    }
};
