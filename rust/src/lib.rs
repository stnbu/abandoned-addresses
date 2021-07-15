use wasm_bindgen::prelude::*;

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    let window = web_sys::window().expect("could not get a `window`");
    let document = window.document().expect("could not get a `document`");
    let body = document.body().expect("could not get a `body`");
    let val = document.create_element("p")?;
    val.set_inner_html("Hello abandoned-addresses!");
    body.append_child(&val)?;
    console_log!("Congratulations, WASM works here!");
    Ok(())
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
