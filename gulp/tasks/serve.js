module.exports = function () {
    $.gulp.task("serve", function () {
        return new Promise((res, rej) => {
            $.browsersync.init({
                server: "./dest/",
                tunnel: "greensite",
                port: 9000
            });
            res();
        });
    });
};