var obj_name = {}

for (x=0; x<100; x++){
    var random = Math.floor(Math.random() * 2);
    obj_name[random] = obj_name[random] == null ? 1 : obj_name[random]+1;
}
console.log(obj_name);