import os

import dash
from dash import Input, Output, dcc, html, State
from dash_extensions import WebSocket
from dotenv import load_dotenv

load_dotenv(
    dotenv_path="dev.env",
)

# update_graph = """
# (msg) => {
#     if (!msg){return {};}
#     const data = JSON.parse(msg.data).data;
#     console.log(data);
#     return {
#         data: [
#             {
#                 x: data.time,
#                 y: data.value,
#                 type: "scatter",
#             },
#         ],
#         layout: {
#             xaxis: {
#                 title: "Time",
#             },
#             yaxis: {
#                 title: "Noise level",
#             },
#             autosize: true,
#             margin: {
#                 l: 50,
#                 r: 50,
#                 b: 50,
#                 t: 50,
#                 pad: 4,
#             },
#         },
#     };
# };
# """.strip()

external_stylesheets = ["https://codepen.io/chriddyp/pen/bWLwgP.css"]

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
app.layout = html.Div(
    [
        html.Div(
            className="navbar",
            children=[
                html.Img(src=app.get_asset_url("noisetrack-logo.png")),
            ],
        ),
        html.Main(
            children=[
                html.H1("NoiseTrack Live"),
                WebSocket(
                    id="ws",
                    url=f"ws://{os.getenv('WEBSOCKET_HOST')}:{os.getenv('WEBSOCKET_PORT')}",
                ),
                dcc.Graph(id="live-update-graph"),
                dcc.Store(id="live-update-graph-store"),
            ]
        ),
        html.Footer(
            children=[
                html.Img(src=app.get_asset_url("noisetrack-logo.png")),
                html.Span("NoiseTrack is a project by the City of Amsterdam"),
                html.Span("Made by the NoiseTrack team"),
            ]
        ),
    ]
)

# app.clientside_callback(
#     update_graph,
#     Output("live-update-graph", "figure"),
#     Input("ws", "message"),
# )

app.clientside_callback(
    """
    (msg, data) => {
        if (!msg){return {};} 
        let data = [..data, ..(JSON.parse(msg.data).data)].slice(0, 100);
        console.log(data);
        return {
            data: data, 
        };
    };
    """.strip(),
    Output("live-update-graph-store", "data"),
    # Output("live-update-graph", "figure"),
    Input("ws", "message"),
    State("live-update-graph-store", "data"),
)

if __name__ == "__main__":
    app.run_server(debug=True)
