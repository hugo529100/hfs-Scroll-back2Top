exports.repo = "hugo529100/hfs-Scroll-back2Top"
exports.version = 1.2
exports.description = "Scrolls to top after 30seconds delay with toggle options."
exports.apiRequired = 1
exports.frontend_js = 'scrolltop.js'

exports.config = {
  scrollTopEnabled: {
    type: 'boolean',
    label: 'Enable auto scroll to top',
    defaultValue: true,
    frontend: true
  }
}
