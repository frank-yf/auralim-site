import AppKit

// Match OffsetControl / DuskSymbol in auralim-mac. Export transparent masks so
// website colors can follow the same light/dark palette without duplicate art.
let output = URL(fileURLWithPath: "public/images/symbols", isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
for (name, weight) in [("sunrise.fill", NSFont.Weight.semibold), ("sunset.fill", .semibold),
                       ("sun.max.fill", .regular), ("moon.fill", .regular)] {
    guard let symbol = NSImage(systemSymbolName: name, accessibilityDescription: nil)?
        .withSymbolConfiguration(.init(pointSize: 13, weight: weight)),
          let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 64, pixelsHigh: 64,
            bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
            colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0),
          let context = NSGraphicsContext(bitmapImageRep: bitmap) else { fatalError("Missing SF Symbol: \(name)") }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.cgContext.scaleBy(x: 4, y: 4)
    let fit = min(1, min(15 / symbol.size.width, 15 / symbol.size.height))
    let size = NSSize(width: symbol.size.width * fit, height: symbol.size.height * fit)
    symbol.draw(in: NSRect(x: (16-size.width)/2, y: (16-size.height)/2, width: size.width, height: size.height))
    NSGraphicsContext.restoreGraphicsState()
    try bitmap.representation(using: .png, properties: [:])!.write(to: output.appendingPathComponent(name + ".png"))
}
