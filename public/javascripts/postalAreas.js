if (!d3) throw new Error('d3js not found!');
window.dataAreas = Object();
window.dataAreas = Object();

d3.json('data/Finland', function(e, d) {
        if (e) throw e;
        dataAreas.Finland = d;
});
    // function getAges(data)
    // owner: minhlv
    // data: postalAreas.dat object
    // return an array of ages and sort ascending by population
    /*{
        startAge: ,
        endAge: ,
        name: ,
        value:  
    }
    */

window.dataAreas.getAges = function(data) {
        //  if(typeof data === 'string') data = window.dataAreas[data];
        var ageVector = [
            [0, 2],
            [3, 6],
            [7, 12],
            [13, 15],
            [16, 17],
            [18, 19],
            [20, 24],
            [25, 29],
            [30, 34],
            [35, 39],
            [40, 44],
            [45, 49],
            [50, 54],
            [55, 59],
            [60, 64],
            [65, 69],
            [70, 74],
            [75, 79],
            [80, 84],
            [85, '']
        ];
        var prefix = 'he_';
        var vals = ageVector.map(function(d) {
            var feild = prefix + d[0] + '_' + d[1];
            var popu = data.he_vakiy;
            return {
                startage: d[0],
                endage: d[1],
                name: "" + d[0] + " - " + d[1],
                value: data[feild] || 0,
                percent: parseInt(data[feild])/popu
            }
        });
        return vals.sort(function(a, b) {
            return d3.ascending(a.startage, b.startage);
        });
    }
    //end

//function getEduLevel
window.dataAreas.getEduLevels = function(area) {

        var vector = [
            ['ko_perus', 'Basic level studies', 'Basic'],
            ['ko_koul', 'With education, total', 'Total'],
            ['ko_yliop', 'Matriculation examination', 'ME'],
            ['ko_ammat', 'Vocational diploma', 'VD'],
            ['ko_al_kork', 'Lower level university degree', 'LU'],
            ['ko_yl_kork', 'Higher level university degree', 'HU'],
        ];
        var popu = parseInt(area.he_vakiy);
        return vector.map(function(d) {
            var val = area[d[0]] || 0,
                nam = d[1],
                lab = d[2],
                per = val/popu;
            return {
                value: parseInt(val),
                name: nam,
                label: lab,
                percent: per
            }
        });
    }
    //end
