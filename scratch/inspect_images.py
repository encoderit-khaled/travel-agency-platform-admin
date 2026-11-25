import subprocess
try:
    import pytesseract
    from PIL import Image
    for img_name in ['view-currencies-1015-7531.png', 'exchange-rates-configure-currencies-1015-7529.png', 'exchange-rates-1015-7530.png', 'exchange-rates-add-1015-7528.png', 'exchange-rates-view-1015-7527.png']:
        try:
            txt = pytesseract.image_to_string(Image.open(f'scratch/{img_name}'))
            print(f'=== {img_name} ===')
            print(txt.strip()[:600])
        except Exception as e:
            print(f'Error on {img_name}: {e}')
except Exception as e:
    print(f'pytesseract error: {e}')
