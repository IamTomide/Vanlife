exports.replacehtml = function replacehtml(template, product){
    let output = template.replaceAll('{{%image%}}', product.image);
    output = output.replaceAll('{{%status%}}', product.status);
    output = output.replaceAll('{{%id%}}', product._id);
    output = output.replaceAll('{{%name%}}', product.name);
    output = output.replaceAll('{{%price%}}', product.price);
    output = output.replaceAll('{{%desc%}}', product.description);

    return output;
}