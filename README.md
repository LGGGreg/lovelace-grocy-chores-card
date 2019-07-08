# grocy-chores-card
A Lovelace custom card for [custom component Grocy](https://github.com/custom-components/grocy) in Home Assistant.

<img src="https://github.com/isabellaalstrom/lovelace-grocy-chores-card/blob/master/grocy-chores-card.png" alt="Grocy Chores Card" />

Easiest installation via [HACS](https://custom-components.github.io/hacs/). Search the store and if the card or integration you want aren't available, add it as a [custom repository](https://custom-components.github.io/hacs/usage/settings/#add-custom-repositories).

You will need to have/install [card tools](https://github.com/thomasloven/lovelace-card-tools) for this card to work.

For manual installation see [this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

## Example configuration

```yaml
views:
  title: My view
  cards:
    - type: custom:grocy-chores-card
      entity: sensor.grocy
```

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:grocy-chores-card`
| entity | string | **Required** | The entity id of your Grocy sensor


Like my work and want to say thanks? Do it here:

<a href="https://www.buymeacoffee.com/iq1f96D" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
