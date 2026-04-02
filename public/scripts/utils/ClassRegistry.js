
var classes = {};
function registerClass(a_class) {
	classes[a_class.name] = a_class;
}

function getClass(a_class) {
	if (typeof a_class == 'string')
		return classes[a_class];
	return a_class;
}

function createObject(name, ...args) {
    const ClassRef = getClass(name);
    if (ClassRef) {
        return new ClassRef(...args);
    }
    return null;
}