var canvas;
var ctx;

function initHome()
{
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    ctx.font = "64px Monaco";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillText("loading...", 100, 175);

    ctx.font = "128px Menlo Bold";
}

function animateHome()
{
    var pos = 0;
    var id = setInterval(frame, 120);
    var myText = "Hello, my name is Bass.";
    var posX = 100;
    var posY = 200;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillText(">", posX, posY);

    function frame()
    {
        if (pos >= myText.length)
        {
            ctx.fillStyle = "rgb(200, 200, 200)";
            ctx.fillText(">", posX, posY + 128);
            clearInterval(id);
        }
        else
        {
            if (Math.random() > 0.5)
            {
                ctx.fillStyle = "rgb(90, 20, 150)";
                ctx.fillText(myText.slice(pos, pos + 1), posX + 32 + 76 * (pos + 1), posY);

                pos++;
            }
        }
    }
}
