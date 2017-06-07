var canvas;
var ctx;

function initHome()
{
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    ctx.font = "64px Monaco";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgb(220, 220, 220)";
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

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.fillText(">", posX, posY);

    function frame()
    {
        if (pos >= myText.length)
        {
            ctx.fillStyle = "rgb(220, 220, 220)";
            ctx.fillText(">", posX, posY + 128);
            clearInterval(id);
        }
        else
        {
            if (Math.random() > 0.5)
            {
                ctx.fillStyle = "rgb(110, 50, 170)";
                ctx.fillText(myText.slice(pos, pos + 1), posX + 32 + 76 * (pos + 1), posY);

                pos++;
            }
        }
    }
}
