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
        console.log('controlled token: ', canvas.tokens.controlled);
        if (canvas.tokens.controlled.length !== 1 || !hoveredToken._hover) {
            this.updateDisplay("Distance: N/A")
        } else {
            const distance = this.measureDistance(canvas.tokens.controlled[0], hoveredToken);
            this.updateDisplay("Distance: " + distance + "ft");
        }
    }

    static measureDistance(token1, token2) {
        const elevationDistance = Math.abs(token2.data.elevation - token1.data.elevation);
        const gridDistance = this.get5eGridDistance(token1, token2);
        if (elevationDistance !== 0) {
            const hypot = Math.floor(Math.hypot(elevationDistance, gridDistance));
            return hypot - hypot % canvas.scene.data.gridDistance; // round to 5e Grid
        } else {
            return gridDistance;
        }
    }

    static get5eGridDistance(token1, token2) {
        let gridSize = canvas.grid.size;
        let deltaX = Math.abs((token1.x - token2.x) / gridSize);
        let deltaY = Math.abs((token1.y - token2.y) / gridSize);
        let distance = Math.max(deltaX, deltaY);
        console.log(canvas.scene.data.gridDistance);
        return distance * canvas.scene.data.gridDistance;
    }

    static updateDisplay(newValue) {
        $("#distanceDisplay").text(newValue);
    }

}


Hooks.once('renderSceneControls', (controls, html) => { TokenDistanceDisplay.init(controls, html); });
Hooks.on('hoverToken', (hoveredToken) => {TokenDistanceDisplay.selectTokens(hoveredToken); });


console.log("TokenRuler loaded");
