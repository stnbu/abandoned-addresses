use wasm_bindgen::prelude::*;

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn do_wasm() -> String {
    let window = web_sys::window().expect("could not get a `window`");
    let document = window.document().expect("could not get a `document`");
    let body = document.body().expect("could not get a `body`");
    let val = document.create_element("p").unwrap();
    val.set_inner_html("Hello abandoned-addresses2!");
    body.append_child(&val).unwrap();
    console_log!("Congratulations, WASM works here!");
    "bob".to_string()
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
