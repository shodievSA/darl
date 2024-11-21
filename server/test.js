function getFileContents(val, path) {

    let filePath = path;

    for (let key in val) {

        if (typeof val[key] === 'object' && val[key] !== null) {

            let oldPath = filePath;
            
            filePath = filePath + key + "/";
            getFileContents(val[key], filePath);

            filePath = oldPath;

        } else {

            console.log(`Making request to: ${filePath + key}`);

        }

    }

}

let obj = {

    app: {
        'globals.css': null,
        'layout.js': null,
        meals: {
            '[slug]': null,
            'error.js': null,
            'not-found.js': null,
            'page.js': null
        },
        components: {
            'loading.js': null,
            'main-header': null,
            meals: null,
            'nav-link.js': null,
            'submit-button.js': null
        },
        'initdb.mjs': null,
        lib: { 
            'actions.js': null, 
            'getMeals.js': null 
        }
    },
    dir_2: {
        prop_1: "prop_1"
    }
}

getFileContents(obj, "");

