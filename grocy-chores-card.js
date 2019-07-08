
customElements.whenDefined('card-tools').then(() => {
    let cardTools = customElements.get('card-tools');
      
    class GrocyChoresCard extends cardTools.LitElement {
      
      setConfig(config) {
        if (!config.entity) {
          throw new Error('Please define entity');
        }
        this.config = config;
      }
			
			calculateDueDate(dueDate){
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
				var firstDate = new Date();
				var secondDate = new Date(dueDate);
				
				var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
				return diffDays;
			}

			checkDueClass(dueDate) {
				var diffDays = this.calculateDueDate(dueDate);
				if (diffDays == 0)
					return "due-today";
				else if (diffDays < 0)
					return "due";
				else
					return "not-due";
			}

			formatDueDate(dueDate) {
				var diffDays = this.calculateDueDate(dueDate);
				if (diffDays == 0)
					return "Today";
				else if (diffDays == 1)
					return "Tomorrow";
				else
					return dueDate.substr(0, 10);
			}

      render(){
        return cardTools.LitHtml
        `
          ${this._renderStyle()}
          ${cardTools.LitHtml
						`<ha-card>
							<div class="header">
								<div class="name">
									${this.header}
								</div>
          		</div>
							<div>
										${this.chores.map(chore =>
											cardTools.LitHtml`
											<div class="info flex">
												<div>
													${chore._name}
													<div class="secondary ${chore._next_estimated_execution_time != null ? this.checkDueClass(chore._next_estimated_execution_time) : ""}">
														Scheduled for: ${chore._next_estimated_execution_time != null ? this.formatDueDate(chore._next_estimated_execution_time) : "-"}
													</div>
													<div class="secondary">Last tracked: ${chore._last_tracked_time != null ? chore._last_tracked_time.substr(0, 10) : "-"} </div>
												</div>
												<div>
													<mwc-button @click=${ev => this._doNow(chore._chore_id)}>Track</mwc-button>
												</div>
											</div>
											`
										)}
									</div>
						</ha-card>`}
        `;
      }    
      _doNow(choreId){
				console.log("doing chore #" + choreId);
				this._hass.callService("grocy", "execute_chore", {
					chore_id: choreId,
					tracked_time: new Date(),
					done_by: 2
				});
			}
      _renderStyle() {
          return cardTools.LitHtml
          `
            <style>
              ha-card {
                padding: 16px;
              }
              .header {
                padding: 0;
                @apply --paper-font-headline;
                line-height: 40px;
                color: var(--primary-text-color);
                padding: 4px 0 12px;
              }
              .info {
                padding-bottom: 1em;
							}
							.flex {
								display: flex;
								justify-content: space-between;
							}
							.due {
								color: red !important;
							}
							.due-today {
								color: orange !important;
							}
							.secondary {
								display: block;
								color: #8c96a5;
						}
            </style>
          `;
        }
      
      set hass(hass) {
        this._hass = hass;
    
        const entity = hass.states[this.config.entity];
        this.header = this.config.title;
        var chores = JSON.parse(entity.attributes.chores);
        chores.sort(function(a,b){
          return new Date(a._next_estimated_execution_time) - new Date(b._next_estimated_execution_time);
        })
        var allChores = []

        chores.map(chore =>{
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          if(chore._next_estimated_execution_time != null && chore._last_tracked_time != null){
            var firstDate = new Date(chore._next_estimated_execution_time);
            var secondDate = new Date(chore._last_tracked_time);
            
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            if(diffDays > 0) {
              allChores.push(chore);
            }
          }
          else
            allChores.push(chore);
        })
        this.chores = allChores.slice(0,7);

        this.state = entity.state
        this.requestUpdate();
      }
      
        // @TODO: This requires more intelligent logic
      getCardSize() {
        return 3;
      }
    }
    
    customElements.define('grocy-chores-card', GrocyChoresCard);
    });
    
    window.setTimeout(() => {
      if(customElements.get('card-tools')) return;
      customElements.define('grocy-chores-card', class extends HTMLElement{
        setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
      });
    }, 2000);