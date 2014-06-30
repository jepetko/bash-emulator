exports.Formatter = function() {

    this.formatAsTable = function(arr, lineSep) {

        var maxLengths = (function(arr) {
            var maxLengths = [];
            for(var i=0; i<arr.length; i++) {
                var sub = arr[i];
                if( typeof sub.length === 'undefined') continue;
                for(var j=0;j<sub.length; j++) {
                    var l = (sub[j] || '').length;

                    if(maxLengths.length <= j || maxLengths[j] < l) {
                        maxLengths[j] = l;
                    }
                }
            }
            return maxLengths;
        })(arr);

        var str = '';
        for(var i=0; i<arr.length; i++) {
            var sub = arr[i];
            if( typeof sub.length === 'undefined') continue;
            if(i > 0) str += lineSep;
            for(var j=0;j<sub.length; j++) {
                if(j > 0) str += ' ';
                str += this.pad(sub[j], maxLengths[j], 'r');
            }
        }
        return str;
    };

    this.pad = function(str, size, direction) {
        var padded = str;
        if(size > str.length) {
            while(padded.length < size) {
                if(direction == 'l') padded = ' ' + padded;
                if(direction == 'r') padded = padded + ' ';
            }
        }
        return padded;
    };

    this.formatAsLine = function(arr, lineSep) {
        var str = '';
        for(var i=0; i<arr.length; i++) {
            var sub = arr[i];
            if( typeof sub.length === 'undefined') continue;
            if(i > 0) str += lineSep;
            for(var j=0;j<sub.length; j++) {
                if(j > 0) str += ' ';
                str += sub[j];
            }
        }
        return str;
    };
};
