var MMS = MMS || {}

MMS.namespace = function( ns_string ) {

    var parts = ns_string.split("."),
    parent = MMS,
    i;

    if (parts[0] === "MMS") {
        parts = parts.slice(1);
    }

    for(i = 0; i < parts.length; i +=1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};
