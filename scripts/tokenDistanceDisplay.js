class TokenDistanceDisplay {
    static async init(controls, html) {

        const distanceDisplay = $(
            `
            <div id="distanceDisplay">Distance: N/A</div>
            `
        );

        $("#fps").parent().append(distanceDisplay);
    }

    static async selectTokens(hoveredToken){
        if (canvas.tokens.controlled.length !== 1 || !hoveredToken.hover) {
            this.updateDisplay("Distance: N/A")
        } else {
            const distance = this.measureDistance(canvas.tokens.controlled[0], hoveredToken);
            this.updateDisplay("Distance: " + distance + "ft");
        }
    }

    static measureDistance(token1, token2) {
        const elevationDistance = Math.abs(token2.document.elevation - token1.document.elevation);
        const gridDistance = this.get5eGridDistance(token1, token2);
        if (elevationDistance !== 0) {
            const hypot = Math.floor(Math.hypot(elevationDistance, gridDistance));
            return hypot - hypot % canvas.scene.grid.distance; // round to 5e Grid
        } else {
            return gridDistance;
        }
    }

    static get5eGridDistance(token1, token2) {
        let gridSize = canvas.grid.size;
        let deltaX = Math.abs((token1.x - token2.x) / gridSize);
        let deltaY = Math.abs((token1.y - token2.y) / gridSize);
        let distance = Math.max(deltaX, deltaY);
        return distance * canvas.scene.grid.distance;
    }

    static updateDisplay(newValue) {
        $("#distanceDisplay").text(newValue);
    }

}


Hooks.once('renderSceneControls', (controls, html) => { TokenDistanceDisplay.init(controls, html); });
Hooks.on('hoverToken', (hoveredToken) => {TokenDistanceDisplay.selectTokens(hoveredToken); });


console.log("TokenRuler loaded");
