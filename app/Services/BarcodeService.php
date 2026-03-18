<?php

namespace App\Services;

use Picqer\Barcode\BarcodeGeneratorSVG;

class BarcodeService
{
    protected $generator;

    public function __construct()
    {
        $this->generator = new BarcodeGeneratorSVG();
    }

    public function generateBarcodeSVG($barcodeText)
    {
        return $this->generator->getBarcode($barcodeText, $this->generator::TYPE_CODE_128);
    }

    public function saveBarcodeSVG($barcodeText, $filename)
    {
        $directory = public_path('barcodes');
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        $path = $directory . '/' . $filename . '.svg';
        $svg = $this->generateBarcodeSVG($barcodeText);
        file_put_contents($path, $svg);

        return 'barcodes/' . $filename . '.svg';
    }
}